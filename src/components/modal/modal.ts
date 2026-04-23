import {
  isHTMLButtonElement,
  isHTMLElement,
  isKeyPressed,
  KeyboardEventKey,
  Visibility,
} from '@common';
import type { Button, div } from '@components';
import { Element, ScrollLock } from '@components';
import { createView } from './create-view/create-view.js';
import styles from './modal.module.scss';
import type { ModalContent, ModalProps, ModalResult, OnCloseModalHandler } from './modal.types.js';

const { body } = document;

export class Modal extends Element<HTMLDivElement> {
  public parent: HTMLElement | Element;
  public onClose: OnCloseModalHandler = null;
  public onBeforeConfirm: (() => boolean) | null = null;
  private _root: ReturnType<typeof div>;
  private contentRoot: ReturnType<typeof div>;
  private okButton: Button;
  private cancelButton: Button;

  public constructor({
    content,
    showCancelButton = true,
    onClose = null,
    parent = body,
  }: ModalProps) {
    super({ className: styles.backdrop });

    const { contentContainer, okButton, cancelButton, modalRoot } = createView();

    this._root = modalRoot;
    this.contentRoot = contentContainer;
    this.okButton = okButton;
    this.cancelButton = cancelButton;
    this.onClose = onClose;
    this.parent = parent;

    okButton.toggleClass(styles.okButton);

    if (content) {
      this.setContent(content);
    }
    this.showCancelButton(showCancelButton);
    this.append(modalRoot);
    this._init();
  }

  public get root(): ReturnType<typeof div> {
    return this._root;
  }

  public open(): void {
    this.toggle(true);
  }

  public close(result: ModalResult): void {
    this.toggle(false);
    this.onClose?.(result);
  }

  public setContent(content: ModalContent): void {
    this.contentRoot.removeChildren();
    if (typeof content === 'string') {
      this.contentRoot.node.insertAdjacentHTML('beforeend', content);
    } else if (isHTMLElement(content)) {
      this.contentRoot.node.append(content);
    } else {
      this.contentRoot.append(content);
    }
  }

  private showCancelButton(flag: boolean): void {
    this.cancelButton.node.style.display = flag ? '' : Visibility.None;
  }

  // "_init" to prevent collisions with descendants implementing "init"
  private _init(): void {
    this.addListener('click', (event) => {
      this.handleBackdropClick(event);
      this.handleButtonClick(event);
    });
  }

  private handleBackdropClick({ target, currentTarget }: Event): void {
    if (target === currentTarget) {
      this.close('cancelled');
    }
  }

  private handleButtonClick = ({ target }: Event): void => {
    if (!isHTMLButtonElement(target)) {
      return;
    }
    const { okButton, cancelButton, onBeforeConfirm } = this;
    let result: ModalResult = 'confirmed';

    if (target !== okButton.node && target !== cancelButton.node) {
      return;
    }
    result = target === okButton.node ? 'confirmed' : 'cancelled';
    if (result === 'confirmed') {
      // cancelled by user
      if (onBeforeConfirm && !onBeforeConfirm()) {
        return;
      }
    }
    this.close(result);
  };

  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (isKeyPressed(KeyboardEventKey.Escape, event)) {
      this.close('cancelled');
    }
  };

  private render(flag: boolean): void {
    const { parent } = this;
    if (isHTMLElement(parent)) {
      const action = flag ? 'append' : 'removeChild';
      parent[action](this.node);

      return;
    }
    // TODO: fix removeChildByRef in BaseElement
    const action = flag ? 'append' : 'removeChildByRef';
    parent[action](this);
  }

  private toggle(flag: boolean): void {
    if (flag) {
      ScrollLock.toggle(true);
      document.addEventListener('keydown', this.handleDocumentKeydown);

      requestAnimationFrame(() => this.toggleClass(styles.active, true));
      this.render(true);

      return;
    }
    ScrollLock.toggle(false);
    document.removeEventListener('keydown', this.handleDocumentKeydown);
    this.toggleClass(styles.active, false);
    this.addListener(
      'transitionend',
      () => {
        this.render(false);
      },
      { once: true }
    );
  }
}

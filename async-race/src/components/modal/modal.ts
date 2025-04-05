import type { Button } from '../base/index.js';
import { Element } from '../base/index.js';
import type { div } from './../base/tags';
import { scrollLock } from './utils/scroll-lock.js';

import { KeyboardEventKey, Visibility } from '../../constants/index.js';
import { isKeyPressed } from '../../utils/misc.js';
import type { ModalContent, ModalProps, ModalResult, OnCloseModalHandler } from './types.js';
import { createElements } from './utils/create-elements.js';

import styles from './modal.module.scss';

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

    const { contentContainer, okButton, cancelButton, modalRoot } = createElements();

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
    } else {
      this.contentRoot.append(content);
    }
  }

  private showCancelButton(flag: boolean): void {
    this.cancelButton.node.style.display = flag ? '' : Visibility.None;
  }

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
    if (target instanceof HTMLButtonElement) {
      const { okButton, cancelButton, onBeforeConfirm } = this;
      let result: ModalResult = 'confirmed';

      if (target !== okButton.node && target !== cancelButton.node) {
        return;
      }
      result = target === okButton.node ? 'confirmed' : 'cancelled';
      if (result === 'confirmed') {
        // cancelled for some reasons
        if (onBeforeConfirm && !onBeforeConfirm()) {
          return;
        }
      }
      this.close(result);
    }
  };

  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (isKeyPressed(KeyboardEventKey.Escape, event)) {
      this.close('cancelled');
    }
  };

  private render(flag: boolean): void {
    const { parent } = this;
    if (parent instanceof HTMLElement) {
      if (flag) {
        parent.append(this.node);
      } else {
        parent.removeChild(this.node);
      }
    } else {
      if (flag) {
        parent.append(this);
      } else {
        parent.removeChildByRef(this);
      }
    }
  }

  private toggle(flag: boolean): void {
    if (flag) {
      scrollLock.toggle(true);
      document.addEventListener('keydown', this.handleDocumentKeydown);

      requestAnimationFrame(() => this.toggleClass(styles.active, true));
      this.render(true);

      return;
    }
    scrollLock.toggle(false);
    document.removeEventListener('keydown', this.handleDocumentKeydown);
    this.toggleClass(styles.active, false);
    // wait for transition ending
    this.addListener(
      'transitionend',
      () => {
        this.render(false);
      },
      { once: true }
    );
  }
}

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
  public onClose: OnCloseModalHandler = null;
  public onBeforeConfirm: (() => boolean) | null = null;
  private _root: ReturnType<typeof div>;
  private contentRoot: ReturnType<typeof div>;
  private okButton: Button;
  private cancelButton: Button;

  public constructor({ content, showCancelButton = true, onClose = null }: ModalProps) {
    super({ className: styles.backdrop });

    const { contentContainer, okButton, cancelButton, modalRoot } = createElements();

    this._root = modalRoot;
    this.contentRoot = contentContainer;
    this.okButton = okButton;
    this.cancelButton = cancelButton;
    this.onClose = onClose;

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
      const result = target === this.okButton.node ? 'confirmed' : 'cancelled';
      if (result === 'confirmed' && this.onBeforeConfirm) {
        // closing cancelled for some reasons
        if (!this.onBeforeConfirm()) {
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

  private toggle(flag: boolean): void {
    if (flag) {
      scrollLock.toggle(true);
      document.addEventListener('keydown', this.handleDocumentKeydown);

      requestAnimationFrame(() => this.toggleClass(styles.active, true));
      body.append(this.node);

      return;
    }
    scrollLock.toggle(false);
    document.removeEventListener('keydown', this.handleDocumentKeydown);
    this.toggleClass(styles.active, false);
    // wait for transition ending
    this.addListener(
      'transitionend',
      () => {
        body.removeChild(this.node);
      },
      { once: true }
    );
  }
}

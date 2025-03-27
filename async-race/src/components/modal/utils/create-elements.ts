import { Button } from '../../base/index.ts';
import { div } from '../../base/tags.ts';

import styles from '../modal.module.scss';

export enum ButtonText {
  OK = 'ok',
  Cancel = 'cancel',
}

export const createElements = (): {
  contentContainer: ReturnType<typeof div>;
  modalRoot: ReturnType<typeof div>;
  okButton: Button;
  cancelButton: Button;
} => {
  const contentContainer = div({ className: styles.content });

  const okButton = new Button({ className: styles.btn, text: ButtonText.OK });

  const cancelButton = new Button({ className: styles.btn, text: ButtonText.Cancel });

  const buttonsContainer = div({ className: styles.buttons }, cancelButton, okButton);

  const modalRoot = div({ className: styles.modal }, contentContainer, buttonsContainer);

  return { contentContainer, okButton, cancelButton, modalRoot };
};

import type { Element } from '../base/element.ts';

export type ModalResult = 'confirmed' | 'cancelled';

export type OnCloseModalHandler = ((result: ModalResult) => void) | null;

export type ModalContent = Element | string;

export type ModalProps = {
  content: ModalContent;
  showCancelButton?: boolean;
  onClose?: OnCloseModalHandler;
};

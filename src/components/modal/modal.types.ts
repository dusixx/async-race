import type { Element } from '@components';

export type ModalResult = 'confirmed' | 'cancelled';
export type ModalContent = Element | string;
export type OnCloseModalHandler = ((result: ModalResult) => void) | null;

export type ModalProps = {
  content?: ModalContent;
  showCancelButton?: boolean;
  onClose?: OnCloseModalHandler;
  parent?: HTMLElement | Element;
};

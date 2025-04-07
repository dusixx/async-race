import type { Element } from '../../base/element.ts';
import { Modal } from '../modal.ts';

const MODAL_WIDTH_PX = 280;

export const showModalMessage = (htmlText: string, parent?: Element | HTMLElement): void => {
  const modal = new Modal({ content: htmlText, showCancelButton: false, parent });
  modal.root.node.style.width = `${MODAL_WIDTH_PX.toString()}px`;
  modal.open();
};

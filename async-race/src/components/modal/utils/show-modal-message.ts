import type { Element } from '../../base/element.ts';
import { Modal } from '../modal.ts';

const MODAL_WIDTH = '280px';

export const showModalMessage = (htmlText: string, parent?: Element | HTMLElement): void => {
  const modal = new Modal({ content: htmlText, showCancelButton: false, parent });
  modal.root.node.style.width = MODAL_WIDTH;
  modal.open();
};

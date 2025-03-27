import { Modal } from '../modal.ts';

const MODAL_WIDTH = '280px';

export const showModalMessage = (htmlText: string): void => {
  const modal = new Modal({ content: htmlText, showCancelButton: false });

  modal.root.node.style.width = MODAL_WIDTH;
  modal.open();
};

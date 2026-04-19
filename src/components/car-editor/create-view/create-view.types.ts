import type { Button, div, input, select, span } from '@components';

export type CarEditorView = {
  wrapper: ReturnType<typeof div>;
  carView: ReturnType<typeof div>;
  nameInput: ReturnType<typeof input>;
  colorInput: ReturnType<typeof input>;
  typeSelect: ReturnType<typeof select>;
  heading: ReturnType<typeof span>;
  randomName: Button;
};

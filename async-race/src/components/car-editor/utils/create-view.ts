import { div, input, paragraph, span } from '../../base/tags.ts';

import styles from '../car-editor.module.scss';

type CreateViewReturn = {
  wrapper: ReturnType<typeof div>;
  carView: ReturnType<typeof div>;
  carName: ReturnType<typeof input>;
  carColor: ReturnType<typeof input>;
  heading: ReturnType<typeof span>;
  note: ReturnType<typeof paragraph>;
};

const MAX_CAR_NAME_LEN = 200;
const MIN_CAR_NAME_LEN = 5;

export const createView = (): CreateViewReturn => {
  const wrapper = div({ className: styles.editorWrapper });

  const note = paragraph({ className: styles.note });
  const heading = span({ className: styles.heading });
  const carView = div({ className: styles.carView });

  const inputsWrapper = div({ className: styles.inputsWrapper });
  const carName = input({
    className: styles.carName,
    required: true,
    maxLength: MAX_CAR_NAME_LEN,
    minLength: MIN_CAR_NAME_LEN,
  });
  const carColor = input({ className: styles.carColor, type: 'color' });
  inputsWrapper.append(carName, carColor);

  wrapper.append(heading, carView, inputsWrapper, note);

  return { wrapper, heading, carView, carName, carColor, note };
};

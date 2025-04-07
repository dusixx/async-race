import { Icon } from '../../../constants/index.ts';
import { Button } from '../../base/button.ts';
import { div, input, label, option, select, span } from '../../base/tags.ts';
import { CAR_TYPE } from '../../car/utils/misc.ts';

import styles from '../car-editor.module.scss';

const MIN_CAR_NAME_LEN = 2;
const MAX_CAR_NAME_LEN = 150;
const TYPE_SELECT_ID = 'car-type';
const COLOR_INPUT_ID = 'car-color';
const TYPE_LABEL_TEXT = 'Driver:';
const COLOR_LABEL_TEXT = 'Color:';
const RANDOM_NAME_BUTTON_TEXT = Icon.GameDie;
const RANDOM_NAME_BUTTON_TITLE = 'random name';

type CreateViewReturn = {
  wrapper: ReturnType<typeof div>;
  carView: ReturnType<typeof div>;
  nameInput: ReturnType<typeof input>;
  colorInput: ReturnType<typeof input>;
  typeSelect: ReturnType<typeof select>;
  heading: ReturnType<typeof span>;
  randomName: Button;
};

const createTypeSelectWrapper = (): {
  typeSelectWrapper: ReturnType<typeof div>;
  typeSelect: ReturnType<typeof select>;
} => {
  const options = Object.keys(CAR_TYPE).map((type) => {
    return option({ text: type, value: type });
  });

  const typeSelect = select({ className: styles.typeSelect, id: TYPE_SELECT_ID }, ...options);

  const typeLabel = label({
    className: styles.label,
    htmlFor: TYPE_SELECT_ID,
    text: TYPE_LABEL_TEXT,
  });

  const typeSelectWrapper = div({ className: styles.fieldWrapper }, typeLabel, typeSelect);

  return { typeSelectWrapper, typeSelect };
};

const createColorInputWrapper = (): {
  colorInputWrapper: ReturnType<typeof div>;
  colorInput: ReturnType<typeof input>;
} => {
  const colorLabel = label({
    className: styles.label,
    text: COLOR_LABEL_TEXT,
    htmlFor: COLOR_INPUT_ID,
  });
  const colorInput = input({ className: styles.colorInput, type: 'color', id: COLOR_INPUT_ID });

  const colorInputWrapper = div({ className: styles.fieldWrapper }, colorLabel, colorInput);

  return { colorInputWrapper, colorInput };
};

const createNameInputWrapper = (): {
  nameInputWrapper: ReturnType<typeof div>;
  nameInput: ReturnType<typeof input>;
  randomName: Button;
} => {
  const nameInput = input({
    className: styles.nameInput,
    required: true,
    maxLength: MAX_CAR_NAME_LEN,
    minLength: MIN_CAR_NAME_LEN,
  });
  const randomName = new Button({
    className: styles.randomName,
    text: RANDOM_NAME_BUTTON_TEXT,
    title: RANDOM_NAME_BUTTON_TITLE,
  });

  const nameInputWrapper = div({ className: styles.nameInputWrapper }, nameInput, randomName);

  return { nameInputWrapper, nameInput, randomName };
};

export const createView = (): CreateViewReturn => {
  const wrapper = div({ className: styles.editorWrapper });
  const heading = span({ className: styles.heading });
  const carView = div({ className: styles.carView });

  const { typeSelect, typeSelectWrapper } = createTypeSelectWrapper();
  const { colorInput, colorInputWrapper } = createColorInputWrapper();
  const { nameInput, randomName, nameInputWrapper } = createNameInputWrapper();

  const typeAndColorWrapper = div(
    { className: styles.groupWrapper },
    typeSelectWrapper,
    colorInputWrapper
  );

  wrapper.append(heading, carView, typeAndColorWrapper, nameInputWrapper);

  return {
    wrapper,
    heading,
    carView,
    nameInput,
    randomName,
    colorInput,
    typeSelect,
  };
};

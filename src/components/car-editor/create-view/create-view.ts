import { Button, div, input, label, option, select, span } from '@components';
import { carMarkup } from '@data';
import styles from '../car-editor.module.scss';
import {
  COLOR_INPUT_ID,
  COLOR_LABEL_TEXT,
  MAX_CAR_NAME_LEN,
  MIN_CAR_NAME_LEN,
  RANDOM_NAME_BUTTON_TEXT,
  RANDOM_NAME_BUTTON_TITLE,
  TYPE_LABEL_TEXT,
  TYPE_SELECT_ID,
} from './create-view.constants.ts';
import type { CarEditorView } from './create-view.types.ts';

const createTypeSelectWrapper = (): {
  typeSelectWrapper: ReturnType<typeof div>;
  typeSelect: ReturnType<typeof select>;
} => {
  const options = Object.keys(carMarkup).map((type) => {
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

export const createView = (): CarEditorView => {
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

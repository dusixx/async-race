import { Button } from '../../base/button.ts';
import { div, span } from '../../base/index.ts';
import { svg } from '../../base/svg-element.ts';

import styles from '../track.module.scss';

const ICONS_FILE_PATH = './icons-2.svg';

const buttonsData = {
  start: 'start',
  stop: 'stop',
  edit: 'edit-3',
  remove: 'remove',
};

export type ButtonsMap = Record<string, Button>;

const createButtonsWrapper = (): {
  buttonsMap: ButtonsMap;
  buttonsWrapper: ReturnType<typeof div>;
} => {
  const buttonsMap: ButtonsMap = {};

  const buttonsArray = Object.entries(buttonsData).map(([name, iconId]) => {
    const icon = svg(null, { href: `${ICONS_FILE_PATH}#${iconId}` });

    const button = new Button({ className: styles.button, title: name, id: name });
    if (name === buttonsData.start) {
      button.toggleClass(styles.buttonStart);
    }
    button.node.append(icon.node);
    buttonsMap[name] = button;

    return button;
  });

  const buttonsWrapper = div({ className: styles.buttons }, ...buttonsArray);

  return { buttonsWrapper, buttonsMap };
};

export const createView = (): {
  buttonsMap: ButtonsMap;
  carName: ReturnType<typeof span>;
  headerWrapper: ReturnType<typeof div>;
} => {
  const { buttonsWrapper, buttonsMap } = createButtonsWrapper();
  const carName = span({ className: styles.carName });
  const headerWrapper = div({ className: styles.header }, carName, buttonsWrapper);

  return { buttonsMap, carName, headerWrapper };
};

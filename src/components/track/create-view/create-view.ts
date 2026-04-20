/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Button } from '../../base/button.ts';
import { div, span } from '../../base/index.ts';
import { svg } from '../../base/svg-element.ts';
import styles from '../track.module.scss';
import { ButtonIconId, ICONS_FILE_PATH } from './create-view.constants.ts';
import type { ButtonsMap } from './create-view.types.ts';

const createButtonsWrapper = (): {
  buttonsMap: ButtonsMap;
  buttonsWrapper: ReturnType<typeof div>;
} => {
  const buttonsMap: Record<string, Button> = {};

  const buttonsArray = Object.entries(ButtonIconId).map(([name, iconId]) => {
    const icon = svg(null, { href: `${ICONS_FILE_PATH}#${iconId}` });

    const button = new Button({ className: styles.button, title: name, id: name });
    if (name === ButtonIconId.start) {
      button.toggleClass(styles.start);
    }
    if (name === ButtonIconId.stop) {
      button.toggleClass(styles.stop);
    }
    button.node.append(icon.node);
    buttonsMap[name] = button;

    return button;
  });
  const buttonsWrapper = div({ className: styles.buttons }, ...buttonsArray);

  return {
    buttonsWrapper,
    buttonsMap: buttonsMap as ButtonsMap,
  };
};

export const createView = (): {
  buttonsMap: ButtonsMap;
  carName: ReturnType<typeof span>;
  headerWrapper: ReturnType<typeof div>;
  overlay: ReturnType<typeof div>;
  statusInfo: ReturnType<typeof span>;
} => {
  const { buttonsWrapper, buttonsMap } = createButtonsWrapper();
  const carName = span({ className: styles.carName });
  const headerWrapper = div({ className: styles.header }, buttonsWrapper, carName);
  const statusIcon = span({ className: styles.statusIcon });
  const statusText = span({ className: styles.statusText });
  const statusInfo = div({ className: styles.statusInfo }, statusIcon, statusText);
  const overlay = div({ className: styles.overlay }, statusInfo);

  return {
    overlay,
    buttonsMap,
    carName,
    headerWrapper,
    statusInfo,
  };
};

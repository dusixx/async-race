/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Button, div, span, svg } from '@components';
import styles from '../track.module.scss';
import { ButtonIconId, ICONS_FILE_PATH } from './create-view.constants.ts';
import type { ButtonMap } from './create-view.types.ts';

const createButtonsWrapper = (): {
  buttonsMap: ButtonMap;
  buttonsWrapper: ReturnType<typeof div>;
} => {
  const buttonsMap: Record<string, Button> = {};

  const buttonsArray = Object.entries(ButtonIconId).map(([name, iconId]) => {
    const icon = svg(null, { href: `${ICONS_FILE_PATH}#${iconId}` });

    const button = new Button({ className: styles.button, title: name, id: name });
    if (iconId === ButtonIconId.start) {
      button.toggleClass(styles.start);
    }
    if (iconId === ButtonIconId.stop) {
      button.toggleClass(styles.stop);
    }
    button.node.append(icon.node);
    buttonsMap[name] = button;

    return button;
  });
  const buttonsWrapper = div({ className: styles.buttons }, ...buttonsArray);

  return {
    buttonsWrapper,
    buttonsMap: buttonsMap as ButtonMap,
  };
};

export const createView = (): {
  buttonsMap: ButtonMap;
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

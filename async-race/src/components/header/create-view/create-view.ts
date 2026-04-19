/* eslint-disable max-lines-per-function */
import { div, img, input, label } from '@components';
import styles from '../header.module.scss';
import {
  GARAGE_LABEL_TEXT,
  GARAGE_RADIO_ID,
  LOGO_IMG_ALT,
  LOGO_IMG_SRC,
  RADIO_GROUP_NAME,
  WINNERS_LABEL_TEXT,
  WINNERS_RADIO_ID,
} from './create-view.constants.ts';

export const createView = (): {
  wrapper: ReturnType<typeof div>;
  garageRadio: ReturnType<typeof input>;
  winnersRadio: ReturnType<typeof input>;
} => {
  const wrapper = div({ className: styles.wrapper });
  const logo = img({ className: styles.logo, src: LOGO_IMG_SRC, alt: LOGO_IMG_ALT });

  const garageRadio = input({
    type: 'radio',
    className: styles.input,
    checked: true,
    name: RADIO_GROUP_NAME,
    value: GARAGE_RADIO_ID,
    id: GARAGE_RADIO_ID,
  });

  const winnersRadio = input({
    type: 'radio',
    className: styles.input,
    name: RADIO_GROUP_NAME,
    value: WINNERS_RADIO_ID,
    id: WINNERS_RADIO_ID,
  });

  const garageLabel = label({
    className: styles.radioLabelLeft,
    htmlFor: GARAGE_RADIO_ID,
    text: GARAGE_LABEL_TEXT,
  });

  const winnersLabel = label({
    className: styles.radioLabelRight,
    htmlFor: WINNERS_RADIO_ID,
    text: WINNERS_LABEL_TEXT,
  });

  const garageRadioWrapper = div({ className: styles.radioWrapper }, garageRadio, garageLabel);
  const winnersRadioWrapper = div({ className: styles.radioWrapper }, winnersRadio, winnersLabel);
  const navWrapper = div({ className: styles.navWrapper }, garageRadioWrapper, winnersRadioWrapper);

  wrapper.append(logo, navWrapper);

  return {
    wrapper,
    garageRadio,
    winnersRadio,
  };
};

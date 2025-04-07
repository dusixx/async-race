/* eslint-disable max-lines-per-function */
import { div, img, input, label } from '../../../components/base/index.ts';
import { Icon } from '../../../constants/index.ts';

import styles from '../header.module.scss';

const RADIO_GROUP_NAME = 'nav-buttons';
const GARAGE_RADIO_ID = 'garage-nav';
const WINNERS_RADIO_ID = 'winners-nav';
const GARAGE_LABEL_TEXT = `${Icon.Car} garage`;
const WINNERS_LABEL_TEXT = `${Icon.Reward} winners`;

export const createView = (): {
  wrapper: ReturnType<typeof div>;
  garageRadio: ReturnType<typeof input>;
  winnersRadio: ReturnType<typeof input>;
} => {
  const wrapper = div({ className: styles.wrapper });
  const logo = img({ className: styles.logo, src: './logo.png', alt: 'logo' });

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

  return { wrapper, garageRadio, winnersRadio };
};

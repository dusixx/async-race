/* eslint-disable max-len */
import { showModalMessage } from '../../components/modal/utils/show-modal-message.ts';
import { Icon } from '../../constants/index.ts';

import styles from '../app.module.scss';

const MESSAGE_LS_KEY = 'message-shown-67egd9';
const SHOWN_ONCE_VALUE = '1';

const START_MESSAGE = `
  <p class="${styles.message}">
    <span>${Icon.PointingUp}</span> <b>PLEASE NOTE:</b> This app additionally saves the <b>type</b> property.
    For cars created by another app the appearance (except <b>color</b> and <b>name</b>) 
    will be <b>random</b> each time the data is fetched from the server.
    <p class="${styles.message}">For the best cross-check experience, please <b>restart the server</b></p>
  </p>`;

export const showStartMessageOnce = (): void => {
  const flag = localStorage.getItem(MESSAGE_LS_KEY);
  if (flag === SHOWN_ONCE_VALUE) {
    return;
  }
  showModalMessage(START_MESSAGE);
  localStorage.setItem(MESSAGE_LS_KEY, SHOWN_ONCE_VALUE);
};

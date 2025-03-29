import { createElement } from '../../base/create-element.ts';
import carSVGMarkup from './car-markup.ts';

import styles from '../car.module.scss';

export const BODY_COLOR_CSSVAR = '--color7';

const LEFT_WHEEL_SELECTOR = '#left-wheel';
const RIGHT_WHEEL_SELECTOR = '#right-wheel';

const ERR_WHEEL_ELEMENT_NOT_FOUND = `
  '${LEFT_WHEEL_SELECTOR}' or '${RIGHT_WHEEL_SELECTOR}' not found`;

type CreateViewReturnType = {
  container: HTMLDivElement;
  leftWheel: Element;
  rightWheel: Element;
  svgElement: Element;
};

export const createCarView = (color: string): CreateViewReturnType => {
  const container = createElement('div');
  container.classList.add(styles.container);

  container.insertAdjacentHTML('beforeend', carSVGMarkup);
  container.style.setProperty(BODY_COLOR_CSSVAR, color);

  const svgElement = container.children[0];
  svgElement.classList.add(styles.carImage);

  const leftWheel = svgElement.querySelector(LEFT_WHEEL_SELECTOR);
  const rightWheel = svgElement.querySelector(RIGHT_WHEEL_SELECTOR);

  if (!rightWheel || !leftWheel) {
    throw Error(ERR_WHEEL_ELEMENT_NOT_FOUND);
  }
  rightWheel.classList.add(styles.wheel);
  leftWheel.classList.add(styles.wheel);

  return {
    container,
    svgElement,
    leftWheel,
    rightWheel,
  };
};

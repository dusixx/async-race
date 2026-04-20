import { div } from '@components';
import { carMarkup } from '@data';
import styles from '../car.module.scss';
import {
  BODY_COLOR_CSS_VAR,
  CarViewSelector,
  ERR_WHEEL_ELEMENT_NOT_FOUND,
  SHADOW_OPACITY,
} from './create-view.constants.ts';
import type { CarView, CarViewType } from './create-view.types.ts';
import { getRandomCarViewType } from './create-view.utils.ts';

export const createView = (color: string, type: CarViewType | undefined): CarView => {
  const wrapper = div({ className: styles.wrapper });
  const { node } = wrapper;

  type = type || getRandomCarViewType();

  node.insertAdjacentHTML('beforeend', carMarkup[type]);
  node.style.setProperty(BODY_COLOR_CSS_VAR, color);

  const svgElement = node.children[0];
  svgElement.classList.add(styles.carImage);

  const leftWheel = svgElement.querySelector<HTMLElement>(CarViewSelector.LeftWheel);
  const rightWheel = svgElement.querySelector<HTMLElement>(CarViewSelector.RightWheel);
  const shadow = svgElement.querySelector<HTMLElement>(CarViewSelector.Shadow);

  if (shadow) {
    shadow.style.opacity = SHADOW_OPACITY;
  }

  if (!rightWheel || !leftWheel) {
    throw Error(ERR_WHEEL_ELEMENT_NOT_FOUND);
  }
  rightWheel.classList.add(styles.wheel);
  leftWheel.classList.add(styles.wheel);

  return {
    wrapper,
    svgElement,
    leftWheel,
    rightWheel,
    type,
  };
};

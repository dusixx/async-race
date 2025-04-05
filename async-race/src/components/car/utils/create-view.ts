import { div } from '../../base/tags.ts';
import styles from '../car.module.scss';
import type { CarViewType } from './misc.ts';
import { CAR_TYPE, getRandomCarViewType } from './misc.ts';

const CAR_SHADOW_OPACITY = '0.5';

export enum ColorCSSVariableName {
  Body = '--color-body',
}

enum CarViewSelector {
  LeftWheel = '#left-wheel',
  RightWheel = '#right-wheel',
  Shadow = '#shadow',
}

const ERR_WHEEL_ELEMENT_NOT_FOUND = `
  '${CarViewSelector.LeftWheel}' or '${CarViewSelector.RightWheel}' not found`;

type CreateViewReturnType = {
  wrapper: ReturnType<typeof div>;
  leftWheel: HTMLElement;
  rightWheel: HTMLElement;
  svgElement: Element;
  type: CarViewType;
};

export const createView = (color: string, type: CarViewType | undefined): CreateViewReturnType => {
  const wrapper = div({ className: styles.wrapper });
  const { node } = wrapper;

  type = type || getRandomCarViewType();

  node.insertAdjacentHTML('beforeend', CAR_TYPE[type]);
  node.style.setProperty(ColorCSSVariableName.Body, color);

  const svgElement = node.children[0];
  svgElement.classList.add(styles.carImage);

  const leftWheel = svgElement.querySelector<HTMLElement>(CarViewSelector.LeftWheel);
  const rightWheel = svgElement.querySelector<HTMLElement>(CarViewSelector.RightWheel);
  const shadow = svgElement.querySelector<HTMLElement>(CarViewSelector.Shadow);

  if (shadow) {
    shadow.style.opacity = CAR_SHADOW_OPACITY;
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

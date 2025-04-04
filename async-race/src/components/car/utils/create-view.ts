import bear from '../../../data/cars/bear.ts';
import fox from '../../../data/cars/fox.ts';
import monkey from '../../../data/cars/monkey.ts';
import piggy from '../../../data/cars/piggy.ts';

import { rndInt } from '../../../utils/misc.ts';
import { div } from '../../base/tags.ts';
import styles from '../car.module.scss';

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

export type CarViewType = 'bear' | 'fox' | 'monkey' | 'piggy';

const CAR_TYPE: Record<CarViewType, string> = {
  bear,
  fox,
  monkey,
  piggy,
};

const isCarViewType = (key: string): key is CarViewType => {
  return key in CAR_TYPE;
};

const getRandomCarViewType = (defaultType: CarViewType = 'bear'): CarViewType => {
  const keys = Object.keys(CAR_TYPE);
  const key = keys[rndInt(0, keys.length - 1)];

  return isCarViewType(key) ? key : defaultType;
};

export const createView = (color: string, type?: CarViewType): CreateViewReturnType => {
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

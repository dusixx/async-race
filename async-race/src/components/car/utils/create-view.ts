import bear from '../../../data/cars/bear.ts';
import fox from '../../../data/cars/fox.ts';
import monkey from '../../../data/cars/monkey.ts';
import pig from '../../../data/cars/pig.ts';

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
};

const CAR_TYPE = { bear, fox, monkey, pig };

type ViewType = keyof typeof CAR_TYPE;

const getRandomCarView = (): string => {
  const values = Object.values(CAR_TYPE);
  return values[rndInt(0, values.length - 1)];
};

export const createView = (color: string, type?: ViewType): CreateViewReturnType => {
  const wrapper = div({ className: styles.wrapper });
  const { node } = wrapper;

  const carView = type ? CAR_TYPE[type] : getRandomCarView();

  node.insertAdjacentHTML('beforeend', carView);
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
  };
};

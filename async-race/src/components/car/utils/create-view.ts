import carSVGMarkup from './car-markup.ts';

import { div } from '../../base/tags.ts';
import styles from '../car.module.scss';

export enum CssVariableColor {
  Body = '--color7',
  Stroke = '--color1',
  Halftone = '--color4',
}

const STROKE_COLOR = '#000';
const HALFTONES_COLOR = '#5d667d'; // windshield etc.

const LEFT_WHEEL_SELECTOR = '#left-wheel';
const RIGHT_WHEEL_SELECTOR = '#right-wheel';

const ERR_WHEEL_ELEMENT_NOT_FOUND = `
  '${LEFT_WHEEL_SELECTOR}' or '${RIGHT_WHEEL_SELECTOR}' not found`;

type CreateViewReturnType = {
  wrapper: ReturnType<typeof div>;
  leftWheel: HTMLElement;
  rightWheel: HTMLElement;
  svgElement: Element;
};

export const createView = (color: string): CreateViewReturnType => {
  const wrapper = div({ className: styles.wrapper });
  const { node } = wrapper;

  node.insertAdjacentHTML('beforeend', carSVGMarkup);

  node.style.setProperty(CssVariableColor.Body, color);
  node.style.setProperty(CssVariableColor.Stroke, STROKE_COLOR);
  node.style.setProperty(CssVariableColor.Halftone, HALFTONES_COLOR);

  const svgElement = node.children[0];
  svgElement.classList.add(styles.carImage);

  const leftWheel = svgElement.querySelector<HTMLElement>(LEFT_WHEEL_SELECTOR);
  const rightWheel = svgElement.querySelector<HTMLElement>(RIGHT_WHEEL_SELECTOR);

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

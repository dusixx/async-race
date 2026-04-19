export * from '../../services/api/shared/http-error.ts';
export * from './color.ts';
export * from './timing-funcs.ts';
export * from './type-guards.ts';

import type { ButtonsMap } from '@common/types/index.ts';
import type { Element } from '@components';
import { Modal } from '@components';
import brands from '@data/brands.ts';
import type { KeyboardEventKey } from '../constants/index.ts';

export const isPositiveInt = (v: number | string): v is number => {
  const number = typeof v === 'number' ? v : parseFloat(v);
  return Number.isInteger(number);
};

export const rndInt = (min: number, max: number): number => {
  return Math.round(min + Math.random() * (max - min));
};

export function JSONParse(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return;
  }
}

export const getRootCSSVariable = (name: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};

export const fitIntoRange = (v: number | string, min: number, max: number): number => {
  if (Number(v) > max) {
    return max;
  }
  if (Number(v) < min) {
    return min;
  }
  return Number(v);
};

export const randomizeArray = <T>(array: T[], count: number = array.length): T[] => {
  const a = [...array];

  return Array.from(
    { length: Math.min(count, a.length) },
    () => a.splice(rndInt(0, a.length - 1), 1)[0]
  );
};

export const isKeyPressed = (key: KeyboardEventKey, event: KeyboardEvent): boolean => {
  const { key: k, ctrlKey: ctrl, altKey: alt, shiftKey: shift } = event;
  return k === key.toString() && !ctrl && !alt && !shift;
};

export const radToDeg = (rad: number): number => rad * (180 / Math.PI);

export function getRandomCarName(): string {
  const { brand, models } = brands[rndInt(0, brands.length - 1)];
  const model = models[rndInt(0, models.length - 1)];

  return `${brand} ${model}`;
}

const MODAL_WIDTH_PX = 280;

export const showModalMessage = (htmlText: string, parent?: Element | HTMLElement): void => {
  const modal = new Modal({ content: htmlText, showCancelButton: false, parent });
  modal.root.node.style.width = `${MODAL_WIDTH_PX.toString()}px`;
  modal.open();
};

export const toggleButtons = (
  buttons: ButtonsMap,
  flag: boolean,
  exceptNames: string[] = []
): void => {
  Object.entries(buttons).forEach(([name, button]) => {
    button.disabled = exceptNames.includes(name) ? !flag : flag;
  });
};

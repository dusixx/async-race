import type { KeyboardEventKey } from '../constants/index.ts';

export const genId = (): string => {
  return Math.random().toString(24).slice(2);
};

export const isPositiveInt = (v: number | string): v is number => {
  return Number.isInteger(typeof v === 'number' ? v : parseFloat(v));
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

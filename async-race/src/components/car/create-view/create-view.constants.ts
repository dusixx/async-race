import { bear, fox, monkey, piggy, turtle, wolf } from '@data';
import type { CarViewType } from './create-view.types.ts';

export const SHADOW_OPACITY = '0.5';

export const BODY_COLOR_CSS_VAR = '--color-body';

export const CarViewSelector = {
  LeftWheel: '#left-wheel',
  RightWheel: '#right-wheel',
  Shadow: '#shadow',
} as const;

export const ERR_WHEEL_ELEMENT_NOT_FOUND = `
  '${CarViewSelector.LeftWheel}' or '${CarViewSelector.RightWheel}' not found`;

export const DEFAULT_CAR_TYPE = 'bear';

export const CarViewMarkup: Record<CarViewType, string> = {
  bear,
  fox,
  monkey,
  piggy,
  wolf,
  turtle,
} as const;

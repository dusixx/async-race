import { rndInt } from '@common';
import { CarViewMarkup, DEFAULT_CAR_TYPE } from './create-view.constants.ts';
import type { CarViewType } from './create-view.types.ts';

export const isCarViewType = (key: string): key is CarViewType => {
  return key in CarViewMarkup;
};

export const getRandomCarViewType = (defaultType: CarViewType = DEFAULT_CAR_TYPE): CarViewType => {
  const keys = Object.keys(CarViewMarkup);
  const key = keys[rndInt(0, keys.length - 1)];

  return isCarViewType(key) ? key : defaultType;
};

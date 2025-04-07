import bear from '../../../data/cars/bear.ts';
import fox from '../../../data/cars/fox.ts';
import monkey from '../../../data/cars/monkey.ts';
import piggy from '../../../data/cars/piggy.ts';
import turtle from '../../../data/cars/turtle.ts';
import wolf from '../../../data/cars/wolf.ts';
import { rndInt } from '../../../utils/misc.ts';

const DEFAULT_CAR_TYPE = 'bear';

export type CarViewType = 'bear' | 'fox' | 'monkey' | 'piggy' | 'wolf' | 'turtle';

export const CAR_TYPE: Record<CarViewType, string> = {
  bear,
  fox,
  monkey,
  piggy,
  wolf,
  turtle,
};

export const isCarViewType = (key: string): key is CarViewType => {
  return key in CAR_TYPE;
};

export const getRandomCarViewType = (defaultType: CarViewType = DEFAULT_CAR_TYPE): CarViewType => {
  const keys = Object.keys(CAR_TYPE);
  const key = keys[rndInt(0, keys.length - 1)];

  return isCarViewType(key) ? key : defaultType;
};

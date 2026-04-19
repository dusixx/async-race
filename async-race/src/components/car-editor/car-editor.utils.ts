import { getRandomCarName, getRandomHexColor } from '@common';
import { Car } from '@components';

export const createRandomCar = (): Car => {
  return new Car({
    name: getRandomCarName(),
    color: getRandomHexColor(),
  });
};

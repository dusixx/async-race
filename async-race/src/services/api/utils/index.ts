import { brands } from '../../../data/brands.ts';
import { colorPalette } from '../../../data/color-palette.ts';
import { rndInt } from '../../../utils/misc.ts';
import type { CarData, CarVelocityAndDistance } from '../types.ts';

export const isCarData = (data: unknown): data is CarData => {
  return (
    typeof data === 'object' && data != null && 'name' in data && 'color' in data && 'id' in data
  );
};

export const isCarDataArray = (data: unknown): data is CarData[] => {
  return Array.isArray(data) && isCarData(data[0]);
};

export const isCarVelocityAndDistance = (data: unknown): data is CarVelocityAndDistance => {
  return typeof data === 'object' && data != null && 'velocity' in data && 'distance' in data;
};

export function getRandomCarName(): string {
  const { brand, models } = brands[rndInt(0, brands.length - 1)];
  const model = models[rndInt(0, models.length - 1)];

  return `${brand} ${model}`;
}

export function getRandomHexColor(): string {
  return colorPalette[rndInt(0, colorPalette.length - 1)];
}

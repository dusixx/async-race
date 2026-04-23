import type { CarData, CarVelocityAndDistance } from './garage-api.types.ts';

export const isCarData = (data: unknown): data is CarData => {
  return (
    typeof data === 'object' &&
    data != null &&
    'name' in data &&
    'color' in data &&
    'id' in data &&
    typeof data.name === 'string' &&
    typeof data.color === 'string' &&
    typeof data.id === 'number'
  );
};

export const isCarDataArray = (data: unknown): data is CarData[] => {
  return Array.isArray(data) && isCarData(data[0]);
};

export const isCarVelocityAndDistance = (data: unknown): data is CarVelocityAndDistance => {
  return typeof data === 'object' && data != null && 'velocity' in data && 'distance' in data;
};

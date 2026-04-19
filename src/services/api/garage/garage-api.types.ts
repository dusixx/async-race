import type { CarViewType } from '@components/car/create-view/create-view.types.ts';

export type CarDriveStatus = 'finished' | 'broken';

export type CarVelocityAndDistance = {
  velocity: number;
  distance: number;
};

export type CarData = {
  id: number;
  name: string;
  color: string;
  type: CarViewType;
};

export type CarDataPartial = Partial<CarData> & { id: number };

export type AllCarsData = {
  items: CarData[];
  totalCount: number;
};

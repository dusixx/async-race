import type { CarViewType } from '../../components/car/utils/misc.ts';

export type QueryParameterValue = string | number | boolean | null | undefined;

export type QueryParameters = Record<string, QueryParameterValue>;

export enum CarEngineStatus {
  Started = 'started',
  Stopped = 'stopped',
  Drive = 'drive',
}

export type CarDriveStatusType = 'finished' | 'broken';

export type CarEngineStatusType = `${CarEngineStatus}`;

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

export type AllCarsData = {
  items: CarData[];
  totalCount: number;
};

export type WinnerData = {
  id: number;
  wins: number;
  time: number;
};

export type AllWinnersData = {
  items: WinnerData[];
  totalCount: number;
};

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
  name: string;
  color: string;
  id: number;
};

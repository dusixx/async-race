import type { CarData, CarDriveStatusType, CarEngineStatusType } from '../../services/api/types.ts';

export type CarStatus = Exclude<CarEngineStatusType, 'drive'> | CarDriveStatusType;

export type UpdateCarData = Partial<Omit<CarData, 'id'>>;

export type OnStoppedHandler = (() => void) | null;

export type OnStartedHandler = (() => void) | null;

export type OnFinishedHandler = (() => void) | null;

export type OnBrokenHandler = (() => void) | null;

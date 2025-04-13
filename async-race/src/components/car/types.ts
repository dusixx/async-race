import type { CarData, CarDriveStatusType } from '../../services/api/types.ts';

export type UpdateCarData = Partial<Omit<CarData, 'id'>>;

export type CarStats = Partial<Record<CarStatus, number>>;

export type OnStatusChangeHandler = ((status: CarStatus, stats?: CarStats) => void) | null;

export type CarStatus = 'starting' | 'started' | 'stopping' | 'stopped' | CarDriveStatusType;

export type UpdateStatus = 'created' | 'updated';

import type { CarData, CarVelocityAndDistance, WinnerData } from '../types.ts';
import { HttpError, HttpStatus } from './http-error.ts';

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

export const isWinnerData = (data: unknown): data is WinnerData => {
  return (
    typeof data === 'object' &&
    data != null &&
    'id' in data &&
    'wins' in data &&
    'time' in data &&
    typeof data.wins === 'number' &&
    typeof data.time === 'number' &&
    typeof data.id === 'number'
  );
};

export const isWinnerDataArray = (data: unknown): data is WinnerData[] => {
  return Array.isArray(data) && isWinnerData(data[0]);
};

export const isCarVelocityAndDistance = (data: unknown): data is CarVelocityAndDistance => {
  return typeof data === 'object' && data != null && 'velocity' in data && 'distance' in data;
};

export const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'AbortError';
};

export const isInternalServiceError = (error: unknown): boolean => {
  return error instanceof HttpError && error.statusCode === HttpStatus.InternalServerError;
};

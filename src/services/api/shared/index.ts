export * from './constants.ts';
export * from './fetch-data.ts';
export * from './http-error.ts';

import { HttpStatus } from './constants.ts';
import { HttpError } from './http-error.ts';

export const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'AbortError';
};

export const isInternalServiceError = (error: unknown): boolean => {
  return error instanceof HttpError && error.statusCode === HttpStatus.InternalServerError;
};

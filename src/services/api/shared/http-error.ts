import type { HttpStatus } from './constants.ts';

export class HttpError extends Error {
  constructor(
    public statusCode: HttpStatus,
    message?: string
  ) {
    let errorMessage = statusCode.toString();
    if (message) {
      errorMessage += `: ${message}`;
    }
    super(errorMessage);
  }
}

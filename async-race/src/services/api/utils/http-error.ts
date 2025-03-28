export enum HttpStatus {
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

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

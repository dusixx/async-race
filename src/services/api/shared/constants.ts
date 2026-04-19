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

export const BASE_PORT = '3000';
export const BASE_URL = `http://127.0.0.1:${BASE_PORT}`;

export const UPDATE_CONTENT_TYPE = 'application/json';
export const ERR_ALL_REQUIRED = `all fields are required`;
export const ERR_AT_LEAST_ONE_REQUIRED = `at least one field is required`;

export enum Endpoint {
  Cars = 'garage',
  Engine = 'engine',
  Winners = 'winners',
}

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

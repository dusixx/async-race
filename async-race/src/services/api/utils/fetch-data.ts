import type { QueryParameters } from '../types.ts';
// import { HttpError, HttpStatus } from './http-error.ts';

const BASE_PORT = '3000';
const BASE_URL = `http://127.0.0.1:${BASE_PORT}`;

export const CONTENT_TYPE = 'application/json';

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

const createQueryString = (parameters: QueryParameters | null): string => {
  if (!parameters) {
    return '';
  }
  return Object.entries(parameters)
    .map(([key, value]) => {
      const emptyValue = value === '' || value == null;
      return emptyValue ? key : `${key}=${value.toString()}`;
    })
    .join('&');
};

export async function fetchData(
  endpoint: string,
  queryParameters?: QueryParameters | null,
  init?: RequestInit
): Promise<Response | null> {
  let url = `${BASE_URL}/${endpoint}`;

  if (queryParameters) {
    url += `?${createQueryString(queryParameters)}`;
  }
  console.debug('fetchData:', init?.method ?? 'GET', url.replace(BASE_URL, ''));

  return await fetch(url, init);
  // if (!response.ok) {
  //   const httpError = new HttpError(response.status, response.statusText);
  //   if (response.status === HttpStatus.InternalServerError.valueOf()) {
  //     throw httpError;
  //   }
  //   console.debug(httpError);
  // }
  // return response;
}

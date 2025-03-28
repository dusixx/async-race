import type { QueryParameters } from '../types.ts';
import { HttpError } from './http-error.ts';

const BASE_PORT = '3000';
const BASE_URL = `http://127.0.0.1:${BASE_PORT}`;

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
): Promise<Response> {
  let url = `${BASE_URL}/${endpoint}`;

  if (queryParameters) {
    url += `?${createQueryString(queryParameters)}`;
  }
  console.debug('fetchData:', init?.method ?? 'GET', url);

  const response = await fetch(url, init);
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
  }
  return response;
}

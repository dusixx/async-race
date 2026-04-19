import { BASE_URL } from './constants.ts';

type QueryParameterValue = string | number | boolean | null | undefined;

export type QueryParameters = Record<string, QueryParameterValue>;

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

  return await fetch(url, init);
}

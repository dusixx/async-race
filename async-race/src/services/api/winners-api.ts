import type { AllWinnersData, QueryParameters, WinnerData } from './types';
import {
  CONTENT_TYPE,
  Endpoint,
  ERR_ALL_REQUIRED,
  ERR_AT_LEAST_ONE_REQUIRED,
  fetchData,
  HttpMethod,
} from './utils/fetch-data.ts';
import { HttpStatus } from './utils/http-error.ts';
import { isWinnerData, isWinnerDataArray } from './utils/index.ts';

export async function getWinnersTotalCount(): Promise<number> {
  const response = await fetchData(Endpoint.Winners, { _limit: 0 });
  return Number(response?.headers.get('X-Total-Count')) || 0;
}

export async function getAllWinners(queryParameters?: QueryParameters): Promise<AllWinnersData> {
  const response = await fetchData(Endpoint.Winners, queryParameters);
  const data: unknown = await response?.json();

  const totalCount = Number(response?.headers.get('X-Total-Count')) || 0;
  const items = isWinnerDataArray(data) ? data : [];

  return { items, totalCount };
}

export async function getWinner(id: number): Promise<WinnerData | null> {
  const path = `${Endpoint.Winners.toString()}/${id.toString()}`;
  const response = await fetchData(path);
  const data: unknown = await response?.json();

  return isWinnerData(data) ? data : null;
}

export async function createWinner(winnerData: WinnerData): Promise<boolean> {
  if (!winnerData.id || !winnerData.wins || !winnerData.time) {
    throw Error(ERR_ALL_REQUIRED);
  }
  const response = await fetchData(Endpoint.Winners, null, {
    method: HttpMethod.Post,
    headers: {
      'Content-Type': CONTENT_TYPE,
    },
    body: JSON.stringify(winnerData),
  });
  if (response?.status === HttpStatus.InternalServerError) {
    return false;
  }
  const data: unknown = await response?.json();
  if (!isWinnerData(data)) {
    return false;
  }
  return true;
}

export async function deleteWinner(id: number): Promise<boolean> {
  const path = `${Endpoint.Winners.toString()}/${id.toString()}`;
  const response = await fetchData(path, null, {
    method: HttpMethod.Delete,
  });
  return Boolean(response?.ok);
}

export async function updateWinner(
  id: number,
  winnerData: Omit<WinnerData, 'id'>
): Promise<WinnerData | null> {
  if (!winnerData.time && !winnerData.wins) {
    throw Error(ERR_AT_LEAST_ONE_REQUIRED);
  }
  const path = `${Endpoint.Winners.toString()}/${id.toString()}`;
  const response = await fetchData(path, null, {
    method: HttpMethod.Patch,
    headers: {
      'Content-Type': CONTENT_TYPE,
    },
    body: JSON.stringify(winnerData),
  });
  const data: unknown = await response?.json();
  if (!isWinnerData(data)) {
    return null;
  }
  return data;
}

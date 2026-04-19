import { getRandomCarName, getRandomHexColor } from '@common';
import { getRandomCarViewType } from '@components/car/create-view/create-view.utils.ts';
import type { QueryParameters } from '../shared';
import {
  Endpoint,
  ERR_ALL_REQUIRED,
  ERR_AT_LEAST_ONE_REQUIRED,
  fetchData,
  HttpMethod,
  HttpStatus,
  isAbortError,
  UPDATE_CONTENT_TYPE,
} from '../shared';
import { CarEngineStatus } from './garage-api.constants.ts';
import type {
  AllCarsData,
  CarData,
  CarDataPartial,
  CarDriveStatus,
  CarVelocityAndDistance,
} from './garage-api.types.ts';
import { isCarData, isCarDataArray, isCarVelocityAndDistance } from './garage-api.utils.ts';

const stringifyCarData = (data: Partial<CarData>): string => {
  return JSON.stringify({
    name: data.name,
    color: data.color,
    type: data.type,
  });
};

export async function getCarsTotalCount(): Promise<number> {
  const response = await fetchData(Endpoint.Cars, { _limit: 0 });
  return Number(response?.headers.get('X-Total-Count')) || 0;
}

export async function getAllCars(queryParameters?: QueryParameters): Promise<AllCarsData> {
  const response = await fetchData(Endpoint.Cars, queryParameters);
  const data: unknown = await response?.json();

  const totalCount = Number(response?.headers.get('X-Total-Count')) || 0;
  const items = isCarDataArray(data) ? data : [];

  return { items, totalCount };
}

export async function getCar(id: number): Promise<CarData | null> {
  const path = `${Endpoint.Cars.toString()}/${id.toString()}`;
  const response = await fetchData(path);
  const data: unknown = await response?.json();

  return isCarData(data) ? data : null;
}

export async function createCar(carData: Omit<CarData, 'id'>): Promise<CarData | null> {
  if (!carData.color || !carData.name) {
    throw Error(ERR_ALL_REQUIRED);
  }
  const response = await fetchData(Endpoint.Cars, null, {
    method: HttpMethod.Post,
    headers: {
      'Content-Type': UPDATE_CONTENT_TYPE,
    },
    body: stringifyCarData(carData),
  });
  const data: unknown = await response?.json();
  if (!isCarData(data)) {
    return null;
  }
  return data;
}

export async function deleteCar(id: number): Promise<boolean> {
  const path = `${Endpoint.Cars.toString()}/${id.toString()}`;
  const response = await fetchData(path, null, {
    method: HttpMethod.Delete,
  });

  return Boolean(response?.ok);
}

export async function updateCar(carData: CarDataPartial): Promise<CarData | null> {
  if (!carData.color && !carData.name && !carData.type) {
    throw Error(ERR_AT_LEAST_ONE_REQUIRED);
  }
  const path = `${Endpoint.Cars.toString()}/${carData.id.toString()}`;
  const response = await fetchData(path, null, {
    method: HttpMethod.Patch,
    headers: { 'Content-Type': UPDATE_CONTENT_TYPE },
    body: stringifyCarData(carData),
  });
  const data: unknown = await response?.json();
  if (!isCarData(data)) {
    return null;
  }
  return data;
}

export async function updateCarEngineStatus(
  id: number,
  status: Exclude<`${CarEngineStatus}`, 'drive'>,
  signal?: AbortSignal
): Promise<CarVelocityAndDistance | null> {
  try {
    const response = await fetchData(
      Endpoint.Engine.toString(),
      { id, status },
      { method: HttpMethod.Patch, signal }
    );
    const data: unknown = await response?.json();
    if (!isCarVelocityAndDistance(data)) {
      return null;
    }
    return data;
  } catch (error) {
    if (isAbortError(error)) {
      return null;
    }
    throw error;
  }
}

export async function switchCarEngineToDriveMode(
  id: number,
  signal?: AbortSignal
): Promise<CarDriveStatus | null> {
  try {
    const endpoint = Endpoint.Engine.toString();
    const status = CarEngineStatus.Drive;

    const response = await fetchData(
      endpoint,
      { id, status },
      { method: HttpMethod.Patch, signal }
    );

    return response?.status === HttpStatus.InternalServerError ? 'broken' : 'finished';
  } catch (error) {
    if (isAbortError(error)) {
      return null;
    }
    throw error;
  }
}

export async function createCars(count: number): Promise<void> {
  if (count <= 0) {
    return;
  }
  try {
    // test request to catch ERR_CONNECTION_REFUSED
    await getCarsTotalCount();

    const creationRequests = Array.from({ length: count }).map(() =>
      createCar({
        name: getRandomCarName(),
        color: getRandomHexColor(),
        type: getRandomCarViewType(),
      })
    );
    await Promise.all(creationRequests);
  } catch (error) {
    // probably ERR_CONNECTION_REFUSED
    console.debug(error);
  }
}

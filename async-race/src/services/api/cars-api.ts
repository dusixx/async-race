import { getRandomHexColor } from '../../utils/color.ts';
import { getRandomCarName } from '../../utils/misc.ts';
import type { CarDriveStatusType } from './types.ts';
import {
  CarEngineStatus,
  type CarData,
  type CarEngineStatusType,
  type CarVelocityAndDistance,
  type QueryParameters,
} from './types.ts';
import { fetchData } from './utils/fetch-data.ts';
import { HttpError, HttpStatus } from './utils/http-error.ts';
import { isCarData, isCarDataArray, isCarVelocityAndDistance } from './utils/index.ts';

const DEFAULT_CARS_COUNT = 100;
const ERR_DATA_REQUIRED = `'color' and 'name' are required`;
const ERR_INVALID_DATA = `invalid data format`;
const CONTENT_TYPE = 'application/json';

type AllCarsResponse = { items: CarData[]; totalCount: number };

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

const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'AbortError';
};

const isInternalServiceError = (error: unknown): boolean => {
  return error instanceof HttpError && error.statusCode === HttpStatus.InternalServerError;
};

export async function getCarsTotalCount(): Promise<number> {
  const response = await fetchData(Endpoint.Cars, { _limit: 0 });
  return Number(response?.headers.get('X-Total-Count')) || 0;
}

export async function getAllCars(queryParameters?: QueryParameters): Promise<AllCarsResponse> {
  const response = await fetchData(Endpoint.Cars, queryParameters);
  const data: unknown = await response?.json();

  const totalCount = Number(response?.headers.get('X-Total-Count')) || 0;
  const items = isCarDataArray(data) ? data : [];

  return { items, totalCount };
}

export async function getCarById(id: number): Promise<CarData | null> {
  const path = `${Endpoint.Cars.toString()}/${id.toString()}`;
  const response = await fetchData(path);
  const data: unknown = await response?.json();

  return isCarData(data) ? data : null;
}

export async function createCar(carData: Omit<CarData, 'id'>): Promise<CarData> {
  if (!carData.color || !carData.name) {
    throw Error(ERR_DATA_REQUIRED);
  }
  const response = await fetchData(Endpoint.Cars, null, {
    method: HttpMethod.Post,
    headers: {
      'Content-Type': CONTENT_TYPE,
    },
    body: JSON.stringify(carData),
  });
  const data: unknown = await response?.json();
  if (!isCarData(data)) {
    throw TypeError(ERR_INVALID_DATA);
  }
  return data;
}

export async function deleteCarById(id: number | undefined): Promise<void> {
  if (id == null) {
    return;
  }
  const path = `${Endpoint.Cars.toString()}/${id.toString()}`;
  await fetchData(path, null, {
    method: HttpMethod.Delete,
  });
}

export async function updateCarData(id: number, carData: Omit<CarData, 'id'>): Promise<CarData> {
  if (!carData.color || !carData.name) {
    throw Error(ERR_DATA_REQUIRED);
  }
  const path = `${Endpoint.Cars.toString()}/${id.toString()}`;
  const response = await fetchData(path, null, {
    method: HttpMethod.Patch,
    headers: {
      'Content-Type': CONTENT_TYPE,
    },
    body: JSON.stringify(carData),
  });
  const data: unknown = await response?.json();
  if (!isCarData(data)) {
    throw TypeError(ERR_INVALID_DATA);
  }
  return data;
}

export async function updateCarEngineStatus(
  id: number,
  status: Exclude<CarEngineStatusType, 'drive'>
): Promise<CarVelocityAndDistance> {
  const response = await fetchData(
    Endpoint.Engine.toString(),
    {
      id,
      status: status.toString(),
    },
    { method: HttpMethod.Patch }
  );
  const data: unknown = await response?.json();
  if (!isCarVelocityAndDistance(data)) {
    throw TypeError(ERR_INVALID_DATA);
  }
  return data;
}

export async function switchCarEngineToDriveMode(
  id: number,
  signal?: AbortSignal
): Promise<CarDriveStatusType | null> {
  try {
    const endpoint = Endpoint.Engine.toString();
    const status = CarEngineStatus.Drive;

    await fetchData(endpoint, { id, status }, { method: HttpMethod.Patch, signal });

    return 'finished';
  } catch (error) {
    if (isInternalServiceError(error)) {
      return 'broken';
    }
    if (isAbortError(error)) {
      return null;
    }
    throw error;
  }
}

export async function createCars(count: number = DEFAULT_CARS_COUNT): Promise<void> {
  for (let i = count; i; i -= 1) {
    await createCar({
      name: getRandomCarName(),
      color: getRandomHexColor(),
    });
  }
}

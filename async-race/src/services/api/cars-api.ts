import type { CarData, CarVelocityAndDistance, QueryParameters } from './types.ts';
import { CarEngineStatus } from './types.ts';
import { fetchData } from './utils/fetch-data.ts';
import { HttpError, HttpStatus } from './utils/http-error.ts';
import {
  getRandomCarName,
  getRandomHexColor,
  isCarData,
  isCarDataArray,
  isCarVelocityAndDistance,
} from './utils/index.ts';

const ERR_DATA_REQUIRED = `'color' and 'name' are required`;
const ERR_INVALID_DATA = `invalid data format`;
const DEFAULT_CARS_COUNT = 100;

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

export async function getAllCars(queryParameters?: QueryParameters): Promise<CarData[]> {
  const response = await fetchData(Endpoint.Cars, queryParameters);
  const data: unknown = await response.json();

  return isCarDataArray(data) ? data : [];
}

export async function getCarById(id: number): Promise<CarData | null> {
  const response = await fetchData(`${Endpoint.Cars.toString()}/${id.toString()}`);
  const data: unknown = await response.json();

  return isCarData(data) ? data : null;
}

export async function createCar(carData: Omit<CarData, 'id'>): Promise<CarData> {
  if (!carData.color || !carData.name) {
    throw Error(ERR_DATA_REQUIRED);
  }
  const response = await fetchData(Endpoint.Cars, null, {
    method: HttpMethod.Post,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carData),
  });
  const data: unknown = await response.json();
  if (!isCarData(data)) {
    throw TypeError(ERR_INVALID_DATA);
  }
  return data;
}

export async function deleteCarById(id: number | undefined): Promise<void> {
  if (id == null) {
    return;
  }
  await fetchData(`${Endpoint.Cars.toString()}/${id.toString()}`, null, {
    method: HttpMethod.Delete,
  });
}

export async function updateCarData(id: number, carData: Omit<CarData, 'id'>): Promise<CarData> {
  if (!carData.color || !carData.name) {
    throw Error(ERR_DATA_REQUIRED);
  }
  const response = await fetchData(`${Endpoint.Cars.toString()}/${id.toString()}`, null, {
    method: HttpMethod.Patch,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carData),
  });
  const data: unknown = await response.json();
  if (!isCarData(data)) {
    throw TypeError(ERR_INVALID_DATA);
  }
  return data;
}

export async function updateCarEngineStatus(
  id: number,
  status: CarEngineStatus
): Promise<CarVelocityAndDistance> {
  const response = await fetchData(
    Endpoint.Engine.toString(),
    {
      id,
      status,
    },
    { method: HttpMethod.Patch }
  );
  const data: unknown = await response.json();
  if (!isCarVelocityAndDistance(data)) {
    throw TypeError(ERR_INVALID_DATA);
  }
  return data;
}

export async function switchCarEngineToDriveMode(id: number): Promise<boolean> {
  try {
    await fetchData(
      Endpoint.Engine.toString(),
      {
        id,
        status: CarEngineStatus.Drive,
      },
      { method: HttpMethod.Patch }
    );
    return true;
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.statusCode === HttpStatus.InternalServerError) {
        return false;
      }
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

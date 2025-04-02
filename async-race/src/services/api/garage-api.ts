import { getRandomHexColor } from '../../utils/color.ts';
import { getRandomCarName } from '../../utils/misc.ts';
import type { AllCarsData, CarDriveStatusType } from './types.ts';
import {
  CarEngineStatus,
  type CarData,
  type CarEngineStatusType,
  type CarVelocityAndDistance,
  type QueryParameters,
} from './types.ts';
import { CONTENT_TYPE, Endpoint, fetchData, HttpMethod } from './utils/fetch-data.ts';
import { HttpError, HttpStatus } from './utils/http-error.ts';
import {
  isAbortError,
  isCarData,
  isCarDataArray,
  isCarVelocityAndDistance,
} from './utils/index.ts';

const ERR_DATA_REQUIRED = `'color' and 'name' are required`;
const ERR_INVALID_DATA = `invalid data format`;
const ERR_CONNECTION_REFUSED = 'check your connection to the server';

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

export async function deleteCar(id: number): Promise<boolean> {
  const path = `${Endpoint.Cars.toString()}/${id.toString()}`;
  const response = await fetchData(path, null, {
    method: HttpMethod.Delete,
  });

  return Boolean(response?.ok);
}

export async function updateCar(id: number, carData: Omit<CarData, 'id'>): Promise<CarData> {
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
  status: Exclude<CarEngineStatusType, 'drive'>,
  signal?: AbortSignal
): Promise<CarVelocityAndDistance | null> {
  try {
    const response = await fetchData(
      Endpoint.Engine.toString(),
      {
        id,
        status: status.toString(),
      },
      { method: HttpMethod.Patch, signal }
    );
    const data: unknown = await response?.json();
    if (!isCarVelocityAndDistance(data)) {
      throw TypeError(ERR_INVALID_DATA);
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
): Promise<CarDriveStatusType | null> {
  try {
    const endpoint = Endpoint.Engine.toString();
    const status = CarEngineStatus.Drive;

    const response = await fetchData(
      endpoint,
      { id, status },
      { method: HttpMethod.Patch, signal }
    );

    return response?.status === HttpStatus.InternalServerError.valueOf() ? 'broken' : 'finished';
  } catch (error) {
    // if (isInternalServiceError(error)) {
    //   return 'broken';
    // }
    if (isAbortError(error)) {
      return null;
    }
    throw error;
  }
}

export async function createCars(count: number): Promise<void> {
  for (let i = count; i; i -= 1) {
    try {
      await createCar({
        name: getRandomCarName(),
        color: getRandomHexColor(),
      });
    } catch (error) {
      if (!(error instanceof HttpError)) {
        console.debug(ERR_CONNECTION_REFUSED);
        return;
      }
    }
  }
}

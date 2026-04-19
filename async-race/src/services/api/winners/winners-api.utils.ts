import type { WinnerData } from './winners-api.types.ts';

export const isWinnerData = (data: unknown): data is WinnerData => {
  return (
    typeof data === 'object' &&
    data != null &&
    'id' in data &&
    'wins' in data &&
    'time' in data &&
    typeof data.wins === 'number' &&
    typeof data.time === 'number' &&
    typeof data.id === 'number'
  );
};

export const isWinnerDataArray = (data: unknown): data is WinnerData[] => {
  return Array.isArray(data) && isWinnerData(data[0]);
};

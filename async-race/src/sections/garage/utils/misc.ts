import type { CarStats } from '../../../components/car/car.ts';
import type { Track } from '../../../components/track/track.ts';
import { Icon } from '../../../constants/index.ts';
import * as api from '../../../services/api/index.ts';
import type { WinnerData } from '../../../services/api/types.ts';

export const getFinishingTimeSecs = (stats: CarStats): number => {
  const timeMs = (stats.finished ?? 0) - (stats.starting ?? 0);
  return parseFloat((timeMs / 1000).toFixed(3));
};

export async function updateScore(targetTrack: Track): Promise<WinnerData> {
  const { car } = targetTrack;
  const { id } = car;

  const time = getFinishingTimeSecs(car.stats);

  const existingData = await api.getWinner(id);
  if (existingData) {
    return await api.updateWinner(id, {
      time: Math.min(time, existingData.time),
      wins: existingData.wins + 1,
    });
  }
  const data = { id, time, wins: 1 };
  await api.createWinner(data);

  return data;
}

export function showWinnerStatus(targetTrack: Track): void {
  const time = getFinishingTimeSecs(targetTrack.car.stats).toString();
  targetTrack.showStatus({
    message: `won in ${time}`,
    success: true,
    icon: Icon.Reward,
  });
}

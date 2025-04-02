import type { Track } from '../../../components/track/track.ts';
import * as api from '../../../services/api/index.ts';
import type { WinnerData } from '../../../services/api/types.ts';

export async function updateScore(targetTrack: Track): Promise<WinnerData> {
  const { car } = targetTrack;
  const { id } = car;

  const timeMs = (car.stats.finished ?? 0) - (car.stats.starting ?? 0);
  const time = parseFloat((timeMs / 1000).toFixed(3));

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

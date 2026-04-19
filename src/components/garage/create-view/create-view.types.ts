import type { ButtonsMap } from '@common';
import type { div, Paginator, span } from '@components';

export type GarageView = {
  buttonsMap: ButtonsMap;
  wrapper: ReturnType<typeof div>;
  tracksWrapper: ReturnType<typeof div>;
  paginator: Paginator;
  totalCarsCounter: ReturnType<typeof span>;
};

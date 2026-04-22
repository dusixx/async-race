import type { Button, div, Paginator, span } from '@components';
import type { ButtonText } from './create-view.constants.ts';

export type ButtonMap = Record<keyof typeof ButtonText, Button>;

export type GarageView = {
  buttonsMap: ButtonMap;
  wrapper: ReturnType<typeof div>;
  tracksWrapper: ReturnType<typeof div>;
  paginator: Paginator;
  totalCarsCounter: ReturnType<typeof span>;
};

import type { Button, div, span } from '@components';
import type { ButtonIconId } from './create-view.constants.ts';

export type ButtonsMap = Record<keyof typeof ButtonIconId, Button>;

export type TrackView = {
  buttonsMap: ButtonsMap;
  carName: ReturnType<typeof span>;
  headerWrapper: ReturnType<typeof div>;
  overlay: ReturnType<typeof div>;
  statusInfo: ReturnType<typeof span>;
};

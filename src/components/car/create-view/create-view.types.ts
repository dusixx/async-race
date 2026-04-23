import type { div } from '@components';
import type { carMarkup } from '@data';

export type CarViewType = keyof typeof carMarkup;

export type CarView = {
  wrapper: ReturnType<typeof div>;
  leftWheel: HTMLElement;
  rightWheel: HTMLElement;
  svgElement: Element;
  type: CarViewType;
};

import type { div } from '@components';

export type CarViewType = 'bear' | 'fox' | 'monkey' | 'piggy' | 'wolf' | 'turtle';

export type CarView = {
  wrapper: ReturnType<typeof div>;
  leftWheel: HTMLElement;
  rightWheel: HTMLElement;
  svgElement: Element;
  type: CarViewType;
};

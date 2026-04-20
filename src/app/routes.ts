import { Pathname } from '@common';
import type { Element } from '@components';
import { Garage, Winners } from '@components';
import type { Router } from '@router';

export type Route = {
  pathname: string;
  component: (router: Router) => Element;
};

export const routes: Route[] = [
  {
    pathname: Pathname.Garage,
    component: () => new Garage(),
  },
  {
    pathname: Pathname.Root,
    component: () => new Garage(),
  },
  {
    pathname: Pathname.Winners,
    component: () => new Winners(),
  },
];

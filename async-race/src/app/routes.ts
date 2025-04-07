import type { Element } from '../components/base/element.ts';
import type { Router } from '../router/router.ts';
import { Garage } from '../sections/garage/garage.ts';
import { Winners } from '../sections/winners/winners.ts';

export enum Pathname {
  Root = '/',
  Garage = '/garage',
  Winners = '/winners',
  Index = '/index',
  NotFound = '/{404}',
}

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

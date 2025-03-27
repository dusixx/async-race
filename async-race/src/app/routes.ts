import type { Element } from '../components/base/element.ts';
import type { Router } from '../router/router.ts';
import { NotFoundSection } from '../sections/index.ts';

export enum Pathname {
  OptionList = '/',
  DecisionPicker = '/decision-picker',
  Index = '/index',
  NotFound = '/{404}',
}

export type Route = {
  pathname: string;
  component: (router: Router) => Element;
};

export const routes: Route[] = [
  {
    pathname: Pathname.DecisionPicker,
    component: (router: Router) => new NotFoundSection(router),
  },
  {
    pathname: Pathname.OptionList,
    component: (router: Router) => new NotFoundSection(router),
  },
  {
    pathname: Pathname.Index,
    component: (router: Router) => new NotFoundSection(router),
  },
  {
    pathname: Pathname.NotFound,
    component: (router: Router) => new NotFoundSection(router),
  },
];

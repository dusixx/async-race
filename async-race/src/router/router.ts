import type { Route } from '@app/routes.ts';
import { Pathname } from '@common';

enum HistoryAction {
  ReplaceState = 'replaceState',
  PushState = 'pushState',
}

type RouterEventMap = {
  'route-change': (route: Route) => void;
};

type RouterEventHandlers = {
  [key in keyof RouterEventMap]?: Array<RouterEventMap[key]>;
};

export class Router {
  private handlers: RouterEventHandlers = {};

  constructor(private routes: Route[]) {
    this.handlePopstate();

    document.addEventListener('DOMContentLoaded', () => {
      this.navigate(location.pathname);
    });
  }

  public static isPathnamesEqual(path1: string, path2: string): boolean {
    return !path1.localeCompare(path2, 'en', {
      sensitivity: 'base',
    });
  }

  public subscribe(event: keyof RouterEventMap, handler: RouterEventMap[typeof event]): void {
    const found = this.handlers[event]?.find((item) => handler === item);
    if (!found) {
      this.handlers[event] = this.handlers[event] || [];
      this.handlers[event].push(handler);
    }
  }

  public unsubscribe(event: keyof RouterEventMap, handler: RouterEventMap[typeof event]): void {
    this.handlers[event] = this.handlers[event]?.filter((item) => handler !== item);
  }

  public navigate(pathname: string, replace: boolean = false): void {
    this.matchRoute(pathname, replace);
  }

  private callHandlers(
    event: keyof RouterEventMap,
    ...rest: Parameters<RouterEventMap[typeof event]>
  ): void {
    this.handlers[event]?.forEach((handler) => {
      handler(...rest);
    });
  }

  private handlePopstate(): void {
    window.addEventListener('popstate', () => {
      this.navigate(location.pathname);
    });
  }

  private findRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => {
      return Router.isPathnamesEqual(route.pathname, pathname);
    });
  }

  private matchRoute(pathname: string, replace: boolean = false): void {
    const lastPart = pathname.match(/\/[^/]*$/)?.[0] ?? '/';

    const found = this.findRoute(lastPart);
    if (found) {
      const action = replace ? HistoryAction.ReplaceState : HistoryAction.PushState;
      history[action](null, '', lastPart);
      this.callHandlers('route-change', found);

      return;
    }
    const page404 = this.findRoute(Pathname.NotFound);
    if (page404) {
      this.callHandlers('route-change', page404);
    }
  }
}

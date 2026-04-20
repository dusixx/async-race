import type { Route } from '@app/routes.ts';
import { routes } from '@app/routes.ts';
import { EventName } from '@common';
import { Element } from '@components';
import { Router } from '@router';

export class MainSection extends Element {
  private router: Router;

  constructor() {
    super({ tag: 'main' });

    this.router = new Router(routes);

    this.router.subscribe('route-change', this.handleRouteChange);
  }

  public setContent(content: Element): void {
    this.removeChildren();
    this.append(content);
  }

  private handleRouteChange = ({ component }: Route): void => {
    this.dispatch(EventName.BeforeContentChange);
    this.setContent(component(this.router));
  };
}

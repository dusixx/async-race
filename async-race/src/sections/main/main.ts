import type { Route } from '../../app/routes.ts';
import { routes } from '../../app/routes.ts';
import { Element } from '../../components/base/element.ts';
import { EventType } from '../../constants/index.ts';
import { Router } from '../../router/router.ts';

export class MainSection extends Element {
  private router: Router;

  constructor() {
    super({ tag: 'main' });

    this.router = new Router(routes);

    this.router.subscribe('routechange', this.handleRouteChange);
  }

  public setContent(content: Element): void {
    this.removeChildren();
    this.append(content);
  }

  private handleRouteChange = ({ component }: Route): void => {
    this.dispatch(EventType.BeforeContentChange);
    this.setContent(component(this.router));
  };
}

import type { BaseElementProps } from './base-element/base-element.js';
import { Element } from './element.js';

export class Button extends Element<HTMLButtonElement> {
  private _onClick: EventListener | null = null;

  constructor(props: BaseElementProps<HTMLButtonElement>, ...children: Element[]) {
    super({ tag: 'button', type: 'button', ...props }, ...children);

    this.addListener('click', (event: Event) => {
      this._onClick?.(event);
    });
  }

  public get onClick(): EventListener | null {
    return this._onClick;
  }

  public get disabled(): boolean {
    return this.node.disabled;
  }

  public set onClick(handler: EventListener | null) {
    this._onClick = handler;
  }

  public set disabled(flag: boolean) {
    this.node.disabled = flag;
  }
}

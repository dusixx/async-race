import { Visibility } from '../../constants/index.ts';
import { BaseElement } from './base-element';
import type { BaseElementProps } from './create-element.ts';

export class Element<T extends HTMLElement = HTMLElement> extends BaseElement<T> {
  protected override _children: Element[] = [];

  constructor(props?: BaseElementProps<T>, ...children: (Element | null)[]) {
    super(props);
    this.append(...children);
  }

  public get visible(): boolean {
    const { style } = this.node;
    return style.visibility === Visibility.Visible.toString();
  }

  public override get children(): Element[] {
    return this._children;
  }

  public set visible(flag: boolean) {
    const { style } = this.node;
    style.visibility = flag ? Visibility.Visible : Visibility.Hidden;
    style.pointerEvents = flag ? '' : Visibility.None;
  }

  public override append(...children: (Element | null)[]): void {
    children.forEach((child) => {
      if (child) {
        this._children.push(child);
      }
    });
    this.node.append(...children.map((child) => child?.node ?? ''));
  }

  public dispatch(eventType: string, options?: EventInit): boolean {
    return this.node.dispatchEvent(
      new Event(eventType, {
        bubbles: true,
        cancelable: true,
        ...options,
      })
    );
  }

  public dispatchCustom(
    eventType: string,
    detail: Record<string, unknown>,
    options?: EventInit
  ): boolean {
    return this.node.dispatchEvent(
      new CustomEvent(eventType, {
        bubbles: true,
        cancelable: true,
        detail: { ...detail, target: this },
        ...options,
      })
    );
  }

  public allowPointerEvents(flag: boolean): void {
    this.node.style.pointerEvents = flag ? '' : Visibility.None;
  }

  public hide(): void {
    this.node.style.display = Visibility.None;
  }

  public show(): void {
    this.node.style.display = '';
  }
}

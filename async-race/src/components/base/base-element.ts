import type { BaseElementProps } from './create-element.ts';
import { createElement } from './create-element.ts';

export class BaseElement<T extends HTMLElement = HTMLElement> {
  protected _children: BaseElement[] = [];
  private _node: T;

  constructor(props?: BaseElementProps<T>, ...children: (BaseElement | null)[]) {
    const { tag = 'div', text = '', ...rest } = props ?? {};

    this._node = createElement<T>(tag, rest);
    this._node.textContent = text;

    this.append(...children);
  }

  public get children(): BaseElement[] {
    return this._children;
  }

  public get text(): string {
    return this._node.textContent ?? '';
  }

  public get node(): T {
    return this._node;
  }

  public set text(value: string) {
    this._node.textContent = value;
  }

  public append(...children: (BaseElement | null)[]): void {
    children.forEach((child) => {
      if (child) {
        this._children.push(child);
      }
    });
    this._node.append(...children.map((child) => child?.node ?? ''));
  }

  public setAttribute(attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([name, value]) => {
      this.node.setAttribute(name, value);
    });
  }

  public removeAttribute(attributes: string | string[]): void {
    const names = Array.isArray(attributes) ? attributes : [attributes];

    names.forEach((name) => {
      this._node.removeAttribute(name);
    });
  }

  public addListener(...rest: Parameters<typeof this._node.addEventListener>): void {
    this.node.addEventListener(...rest);
  }

  public removeListener(...rest: Parameters<typeof this._node.removeEventListener>): void {
    this.node.removeEventListener(...rest);
  }

  public toggleClass(className: string, force?: boolean): boolean {
    return this.node.classList.toggle(className, force);
  }

  public removeChildByRef(reference: BaseElement): void {
    this._children = this._children.filter((item) => item !== reference);
    reference.remove();
  }

  public remove(): void {
    this.removeChildren();
    this._node.remove();
  }

  public removeChildren(): void {
    this._children.forEach((child) => {
      child.remove();
    });
    this._children.length = 0;
  }
}

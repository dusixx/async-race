import { createElement } from './base-element.utils.ts';

export type BaseElementProps<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, 'tagName' | 'classList'>
> & {
  tag?: keyof HTMLElementTagNameMap;
  text?: string;
};

export class BaseElement<T extends HTMLElement = HTMLElement> {
  public children: BaseElement[] = [];
  public node: T;

  constructor(props?: BaseElementProps<T>, ...children: (BaseElement | null)[]) {
    const { tag = 'div', text = '', ...rest } = props ?? {};

    this.node = createElement<T>(tag, rest);
    this.node.textContent = text;

    this.append(...children);
  }

  public get text(): string {
    return this.node.textContent || '';
  }

  public set text(value: string) {
    this.node.textContent = value;
  }

  public append(...children: (BaseElement | null | undefined)[]): void {
    children.forEach((child) => {
      if (child) {
        this.children.push(child);
      }
    });
    this.node.append(...children.map((child) => child?.node ?? ''));
  }

  public setAttribute(attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([name, value]) => {
      this.node.setAttribute(name, value);
    });
  }

  public removeAttribute(attributes: string | string[]): void {
    const names = Array.isArray(attributes) ? attributes : [attributes];

    names.forEach((name) => {
      this.node.removeAttribute(name);
    });
  }

  public addListener(...rest: Parameters<typeof this.node.addEventListener>): void {
    this.node.addEventListener(...rest);
  }

  public removeListener(...rest: Parameters<typeof this.node.removeEventListener>): void {
    this.node.removeEventListener(...rest);
  }

  public toggleClass(className: string, force?: boolean): boolean {
    return this.node.classList.toggle(className, force);
  }

  public removeChildByRef(reference: BaseElement): void {
    this.children = this.children.filter((item) => item !== reference);
    reference.remove();
  }

  public remove(): void {
    this.removeChildren();
    this.node.remove();
  }

  // TODO: removeChildren should remove only children - not descendants
  public removeChildren(): void {
    this.children.forEach((child) => {
      child.remove();
    });
    this.children.length = 0;
  }
}

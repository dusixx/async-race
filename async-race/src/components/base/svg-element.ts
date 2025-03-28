const NAMESPACE_URI = 'http://www.w3.org/2000/svg';
const LINK_NAMESPACE = 'http://www.w3.org/1999/xlink';

type Props = Partial<Omit<HTMLElement, 'tagName' | 'classList'>>;

type UseAttributtes = Props & { href: string };

export class SVGElement {
  public node: SVGSVGElement;
  public children: SVGUseElement[] = [];

  constructor({ className, ...rest }: Props, ...useAttributes: UseAttributtes[]) {
    const node = document.createElementNS(NAMESPACE_URI, 'svg');

    if (className) {
      node.classList.add(className);
    }
    this.node = node;
    this.append(...useAttributes);
    Object.assign(node, rest);
  }

  public append(...useAttributes: UseAttributtes[]): void {
    useAttributes.map(({ className, href, ...rest }) => {
      const useNode = document.createElementNS(NAMESPACE_URI, 'use');

      if (className) {
        useNode.classList.add(className);
      }
      if (href) {
        useNode.setAttributeNS(LINK_NAMESPACE, 'href', href);
      }
      Object.assign(useNode, rest);
      this.children.push(useNode);
      this.node.appendChild<SVGUseElement>(useNode);
    });
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

  public removeChildByRef(reference: SVGUseElement): void {
    this.children = this.children.filter((item) => item !== reference);
    reference.remove();
  }

  public remove(): void {
    this.removeChildren();
    this.node.remove();
  }

  public removeChildren(): void {
    this.children.forEach((child) => {
      child.remove();
    });
    this.children.length = 0;
  }
}

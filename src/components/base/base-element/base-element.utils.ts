export function createElement<T extends HTMLElement = HTMLDivElement>(
  tag: keyof HTMLElementTagNameMap = 'div',
  props?: object
): T {
  const node = document.createElement(tag) as T;
  Object.assign(node, props);

  return node;
}

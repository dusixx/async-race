const NAMESPACE_URI = 'http://www.w3.org/2000/svg';

type Props = Partial<Omit<HTMLElement, 'tagName' | 'classList'>> | null;

export const createSVGElement = (props?: Props): SVGSVGElement => {
  const { className, ...rest } = props ?? {};
  const node = document.createElementNS(NAMESPACE_URI, 'svg');

  if (className) {
    node.classList.add(className);
  }
  Object.assign(node, rest);

  return node;
};

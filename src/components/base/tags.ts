import type { BaseElementProps } from './index.ts';
import { Element } from './index.ts';

type Props<T extends HTMLElement = HTMLElement> = Omit<BaseElementProps<T>, 'tag'>;

export const div = (
  props?: Props<HTMLDivElement>,
  ...children: Element[]
): Element<HTMLDivElement> => {
  return new Element<HTMLDivElement>({ tag: 'div', ...props }, ...children);
};

export const input = (props?: Props<HTMLInputElement>): Element<HTMLInputElement> => {
  return new Element<HTMLInputElement>({ tag: 'input', ...props });
};

export const label = (
  props?: Props<HTMLLabelElement>,
  ...children: Element[]
): Element<HTMLLabelElement> => {
  return new Element<HTMLLabelElement>({ tag: 'label', ...props }, ...children);
};

export const canvas = (props?: Props<HTMLCanvasElement>): Element<HTMLCanvasElement> => {
  return new Element<HTMLCanvasElement>({ tag: 'canvas', ...props });
};

export const span = (props?: Props<HTMLSpanElement>): Element<HTMLSpanElement> => {
  return new Element<HTMLSpanElement>({ tag: 'span', ...props });
};

export const ul = (
  props?: Props<HTMLUListElement>,
  ...children: Element[]
): Element<HTMLUListElement> => {
  return new Element<HTMLUListElement>({ tag: 'ul', ...props }, ...children);
};

export const li = (
  props?: Props<HTMLLIElement>,
  ...children: Element[]
): Element<HTMLLIElement> => {
  return new Element<HTMLLIElement>({ tag: 'li', ...props }, ...children);
};

export const select = (
  props?: Props<HTMLSelectElement>,
  ...children: Element[]
): Element<HTMLSelectElement> => {
  return new Element<HTMLSelectElement>({ tag: 'select', ...props }, ...children);
};

export const option = (props?: Props<HTMLOptionElement>): Element<HTMLOptionElement> => {
  return new Element<HTMLOptionElement>({ tag: 'option', ...props });
};

export const textArea = (props?: Props<HTMLTextAreaElement>): Element<HTMLTextAreaElement> => {
  return new Element<HTMLTextAreaElement>({ tag: 'textarea', ...props });
};

export const anchor = (props?: Props, ...children: Element[]): Element<HTMLAnchorElement> => {
  return new Element<HTMLAnchorElement>({ tag: 'a', ...props }, ...children);
};

export const paragraph = (props?: Props, ...children: Element[]): Element<HTMLParagraphElement> => {
  return new Element<HTMLParagraphElement>({ tag: 'p', ...props }, ...children);
};

export const section = (props?: Props, ...children: Element[]): Element => {
  return new Element({ tag: 'section', ...props }, ...children);
};

export const header = (props?: Props, ...children: Element[]): Element => {
  return new Element({ tag: 'header', ...props }, ...children);
};

export const main = (props?: Props, ...children: Element[]): Element => {
  return new Element({ tag: 'main', ...props }, ...children);
};

export const img = (
  props?: Props<HTMLImageElement>,
  ...children: Element[]
): Element<HTMLImageElement> => {
  return new Element<HTMLImageElement>({ tag: 'img', ...props }, ...children);
};

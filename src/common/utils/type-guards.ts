export const isHTMLSelectElement = (v: unknown): v is HTMLSelectElement => {
  return v instanceof HTMLSelectElement;
};

export const isHTMLInputElement = (v: unknown): v is HTMLInputElement => {
  return v instanceof HTMLInputElement;
};

export const isHTMLElement = (v: unknown): v is HTMLElement => {
  return v instanceof HTMLElement;
};

export const isHTMLButtonElement = (v: unknown): v is HTMLButtonElement => {
  return v instanceof HTMLButtonElement;
};

export const isError = (v: unknown): v is Error => {
  return v instanceof Error;
};

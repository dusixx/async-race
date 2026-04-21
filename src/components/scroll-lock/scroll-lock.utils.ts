const { body } = document;

export const isVScrollBarVisible = (): boolean => {
  const currentBodyClientWidth = body.clientWidth;
  const currentBodyOverflow = body.style.overflow;

  body.style.overflow = 'hidden';
  const result = currentBodyClientWidth !== body.clientWidth;
  body.style.overflow = currentBodyOverflow;

  return result;
};

export const scrollLockStyle = (bodyCssText: string, windowTopY: number): string => {
  return `
    ${bodyCssText};
    position: fixed;
    top: -${windowTopY.toString()}px;
    width: 100%;
    overflow-y: ${isVScrollBarVisible() ? `scroll` : `hidden`};
  `;
};

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

function easeInOutCirc(x: number): number {
  return x < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

function easeOutCirc(x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

export const timingFunction = {
  easeInOutCirc,
  easeOutBack,
  easeOutQuint,
  easeOutCubic,
  easeOutCirc,
};

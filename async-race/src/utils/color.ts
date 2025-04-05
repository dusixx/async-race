//import colorPalette from '../data/color-palette.ts';
import { rndInt } from './misc.ts';

type ColorRGBHex = { rgb: number[]; hex: string };

export const getRandomColor = ({ min = 0, max = 255 } = {}): ColorRGBHex => {
  const rgb = [0, 0, 0].map(() => rndInt(min, max));
  const hex = rgb.map((v) => v.toString(16).padStart(2, '0'));

  return {
    rgb,
    hex: `#${hex.join('')}`,
  };
};

export const getRndColorMixCss = ({
  min = 25,
  max = 30,
  percent = 50,
  baseColor = '#ffcfcf',
} = {}): string => {
  const randomInt = rndInt(min, max).toString();
  const colorHex = getRandomColor().hex;

  return `color-mix(in oklab, ${colorHex} ${randomInt}%, ${baseColor} ${percent.toString()}%)`;
};

export const isValidHexColor = (color: string): boolean => {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color);
};

// export function getRandomHexColor(): string {
//   return colorPalette[rndInt(0, colorPalette.length - 1)];
// }

export function getRandomHexColor(): string {
  return `#${rndInt(0, 0xffffff).toString(16).padStart(6, '0')}`;
}

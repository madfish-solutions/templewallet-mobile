import { BoxShadowValue } from 'react-native';

export const generateBoxShadow = (x: number, y: number, blur: number, spread: number, color: string) => [
  { offsetX: x, offsetY: y, blurRadius: blur, spreadDistance: spread, color: color }
];

export const iosCardShadow = generateBoxShadow(0, 2, 18, 0, '#0000001A');

export const combineBoxShadows = (...shadows: Array<BoxShadowValue | BoxShadowValue[]>) => shadows.flat();

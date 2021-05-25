/**
 * Data taken from
 * https://ethercreative.github.io/react-native-shadow-generator/
 **/
import { isIOS } from '../config/system';

const androidDepthPenumbra = [
  { x: 0, y: 1, blur: 1, spread: 0 },
  { x: 0, y: 2, blur: 2, spread: 0 },
  { x: 0, y: 3, blur: 4, spread: 0 },
  { x: 0, y: 4, blur: 5, spread: 0 },
  { x: 0, y: 5, blur: 8, spread: 0 },
  { x: 0, y: 6, blur: 10, spread: 0 },
  { x: 0, y: 7, blur: 10, spread: 1 },
  { x: 0, y: 8, blur: 10, spread: 1 },
  { x: 0, y: 9, blur: 12, spread: 1 },
  { x: 0, y: 10, blur: 14, spread: 1 },
  { x: 0, y: 11, blur: 15, spread: 1 },
  { x: 0, y: 12, blur: 17, spread: 2 },
  { x: 0, y: 13, blur: 19, spread: 2 },
  { x: 0, y: 14, blur: 21, spread: 2 },
  { x: 0, y: 15, blur: 22, spread: 2 },
  { x: 0, y: 16, blur: 24, spread: 2 },
  { x: 0, y: 17, blur: 26, spread: 2 },
  { x: 0, y: 18, blur: 28, spread: 2 },
  { x: 0, y: 19, blur: 29, spread: 2 },
  { x: 0, y: 20, blur: 31, spread: 3 },
  { x: 0, y: 21, blur: 33, spread: 3 },
  { x: 0, y: 22, blur: 35, spread: 3 },
  { x: 0, y: 23, blur: 36, spread: 3 },
  { x: 0, y: 24, blur: 38, spread: 3 }
];

const interpolate = (i: number, a: number, b: number, a2: number, b2: number) => ((i - a) * (b2 - a2)) / (b - a) + a2;

// TODO: figure out how do elevation works on Android && fix its behaviour
export const generateShadow = (depth: number, shadowColor: string) => {
  const s = androidDepthPenumbra[depth];
  const y = s.y === 1 ? 1 : Math.floor(s.y * 0.5);

  return isIOS
    ? {
        shadowColor,
        shadowOffset: {
          width: 0,
          height: y
        },
        shadowOpacity: +interpolate(depth, 1, 24, 0.2, 0.6).toFixed(2),
        shadowRadius: +interpolate(s.blur, 1, 38, 1, 16).toFixed(2),

        elevation: depth + 1
      }
    : {};
};

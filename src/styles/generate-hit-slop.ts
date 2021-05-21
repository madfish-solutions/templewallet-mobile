import { Insets } from 'react-native';

export const generateHitSlop = (size: number): Insets => ({
  top: size,
  left: size,
  bottom: size,
  right: size
});

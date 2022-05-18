import { useWindowDimensions } from 'react-native';

export const useFormatScaledSize = (size: number): number => {
  const { fontScale } = useWindowDimensions();

  return size * fontScale;
};

import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useInsetStyles = () => {
  const { top, left, right, bottom } = useSafeAreaInsets();

  return useMemo(
    () => ({ marginTop: top, marginLeft: left, marginRight: right, marginBottom: bottom }),
    [top, left, right, bottom]
  );
};

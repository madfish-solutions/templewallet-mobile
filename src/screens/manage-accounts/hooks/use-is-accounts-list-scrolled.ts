import { useCallback, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface Result {
  isScrolled: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const useIsAccountsListScrolled = (): Result => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIsScrolled = event.nativeEvent.contentOffset.y > 0;

    setIsScrolled(currentIsScrolled => (currentIsScrolled === nextIsScrolled ? currentIsScrolled : nextIsScrolled));
  }, []);

  return { isScrolled, handleScroll };
};

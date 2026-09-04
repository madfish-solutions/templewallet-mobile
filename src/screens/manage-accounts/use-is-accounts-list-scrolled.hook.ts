import { RefObject, useCallback, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

interface Result {
  isScrolled: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollViewRef: RefObject<ScrollView | null>;
}

export const useIsAccountsListScrolled = (): Result => {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIsScrolled = event.nativeEvent.contentOffset.y > 0;

    setIsScrolled(currentIsScrolled => (currentIsScrolled === nextIsScrolled ? currentIsScrolled : nextIsScrolled));
  }, []);

  return { isScrolled, handleScroll, scrollViewRef };
};

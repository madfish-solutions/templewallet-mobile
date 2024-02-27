import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @param isVisible Indicates whether the element is visible right now, assuming that the screen is focused.
 * @param seenTimeout If the element becomes visible and stays visible for this amount of time, it is considered seen.
 * @param shouldResetOnScreenBlur If true, the seen state will be reset when the element becomes invisible.
 */
export const useElementIsSeen = (isVisible: boolean, seenTimeout: number, shouldResetOnScreenBlur = true) => {
  const isFocused = useIsFocused();
  const [isSeen, setIsSeen] = useState(false);
  const resetWasCalledRef = useRef(false);
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    if (shouldResetOnScreenBlur && !isFocused) {
      setIsSeen(false);
    }
  }, [isFocused, shouldResetOnScreenBlur]);

  const updateIsSeen = useCallback(() => {
    isVisibleRef.current = isVisible && isFocused;

    if (isVisible && isFocused) {
      const timeout = setTimeout(() => {
        if (isVisibleRef.current) {
          setIsSeen(true);
        }
      }, seenTimeout);

      return () => clearTimeout(timeout);
    }
  }, [isFocused, isVisible, seenTimeout]);

  const resetIsSeen = useCallback(() => {
    setIsSeen(false);
    resetWasCalledRef.current = true;
  }, []);

  useEffect(updateIsSeen, [updateIsSeen]);
  useEffect(() => {
    if (resetWasCalledRef.current) {
      resetWasCalledRef.current = false;
      updateIsSeen();
    }
  }, [updateIsSeen, isSeen]);

  return { isSeen, resetIsSeen };
};

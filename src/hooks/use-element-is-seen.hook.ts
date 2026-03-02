import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';

import { isDefined } from 'src/utils/is-defined';

/**
 * @param isVisible Indicates whether the element is visible right now, assuming that the screen is focused.
 * @param seenTimeoutDuration If the element becomes visible and stays visible for this amount of time, it is considered seen.
 * @param shouldResetOnScreenBlur If true, the seen state will be reset when the element becomes invisible.
 */
export const useElementIsSeen = (isVisible: boolean, seenTimeoutDuration: number, shouldResetOnScreenBlur = true) => {
  const isFocused = useIsFocused();
  const [isSeen, setIsSeen] = useState(false);
  const resetWasCalledRef = useRef(false);
  const isVisibleRef = useRef(isVisible);
  const seenTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    if (shouldResetOnScreenBlur && !isFocused) {
      setIsSeen(false);
    }
  }, [isFocused, shouldResetOnScreenBlur]);

  const clearSeenTimeout = useCallback(() => {
    void (isDefined(seenTimeoutRef.current) && clearTimeout(seenTimeoutRef.current));
  }, []);

  const updateIsSeen = useCallback(() => {
    isVisibleRef.current = isVisible && isFocused;

    if (isVisible && isFocused) {
      seenTimeoutRef.current = setTimeout(() => {
        if (isVisibleRef.current) {
          setIsSeen(true);
        }
      }, seenTimeoutDuration);

      return () => clearSeenTimeout();
    }
  }, [isFocused, isVisible, seenTimeoutDuration, clearSeenTimeout]);

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

  return { isSeen, resetIsSeen, clearSeenTimeout };
};

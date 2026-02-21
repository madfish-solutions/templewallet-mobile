import { useRef } from 'react';

import { useIsomorphicLayoutEffect } from './use-iso-layout-effect';

export function useCallbackRef<T extends unknown>(callback: () => T) {
  const callbackRef = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return callbackRef;
}

import { useRef } from 'react';

import { useIsomorphicLayoutEffect } from './use-iso-layout-effect';

export function useCallbackRef(callback: () => any) {
  const callbackRef = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return callbackRef;
}

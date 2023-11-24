import { useEffect, useRef } from 'react';

import { useCallbackRef } from './use-callback-ref';
import { useDidMount } from './use-did-mount';
import { useWillUnmount } from './use-will-unmount';

export function useDidUpdate(callback: EmptyFn, conditions: unknown[]) {
  const hasMountedRef = useRef(false);
  const callbackRef = useCallbackRef(callback);

  useEffect(() => {
    if (hasMountedRef.current) {
      callbackRef.current();
    }
  }, conditions);

  useDidMount(() => {
    hasMountedRef.current = true;
  });

  useWillUnmount(() => {
    hasMountedRef.current = false;
  });
}

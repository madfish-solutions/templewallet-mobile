import { useEffect, useRef } from 'react';

/**
 * From a package [usehooks-ts](https://npmjs.com/package/usehooks-ts).
 */
export function useTimeout(callback: EmptyFn, delay: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }
    const id = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(id);
  }, [delay]);
}

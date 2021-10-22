import { DependencyList, EffectCallback, useEffect } from 'react';

export const useDelayedEffect = (ms: number, effect: EffectCallback, deps?: DependencyList) => {
  useEffect(() => {
    const timeoutId = setTimeout(effect, ms);

    return () => clearTimeout(timeoutId);
  }, deps);
};

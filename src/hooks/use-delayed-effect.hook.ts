import { DependencyList, EffectCallback, useEffect } from 'react';

import { isIOS } from '../config/system';

const sleep = (ms: number) => new Promise(resolve => setTimeout(() => resolve(true), ms));

export const useDelayedEffect = (effect: EffectCallback, deps?: DependencyList) =>
  useEffect(() => {
    (async () => {
      await sleep(isIOS ? 1000 : 2000);
      effect();
    })();
  }, deps);

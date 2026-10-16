import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import { Activity, EvmActivity } from './types';

export const isEvmActivity = (activity: Activity): activity is EvmActivity => activity.chain === TempleChainKind.EVM;

export const toActivityKey = (activity: Activity) =>
  `${activity.chain}:${activity.chainId}:${activity.hash.toLowerCase()}`;

// Own guard instead of `signal.throwIfAborted()` - that method exists only via the shim.js polyfill
export const throwIfAborted = (signal?: AbortSignal) => {
  if (signal?.aborted) {
    throw new Error('Aborted');
  }
};

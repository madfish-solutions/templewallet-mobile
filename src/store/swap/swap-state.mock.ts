import type { Route3SwapParamsResponse } from 'src/interfaces/route3.interface';
import { createEntity } from 'src/store/create-entity';

import type { SwapState } from './swap-state';

export const DEFAULT_SWAP_PARAMS: Route3SwapParamsResponse = { input: undefined, output: undefined, chains: [] };

export const mockSwapState: SwapState = {
  swapParams: createEntity(DEFAULT_SWAP_PARAMS),
  dexes: createEntity([]),
  tokens: createEntity([]),
  tokensMetadata: createEntity([])
};

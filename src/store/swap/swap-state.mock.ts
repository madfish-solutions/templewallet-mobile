import { Route3TraditionalSwapParamsResponse, Route3TreeNodeType } from 'src/interfaces/route3.interface';
import { createEntity } from 'src/store/create-entity';
import { mockPersistedState } from 'src/utils/redux';

import type { SwapState } from './swap-state';

export const DEFAULT_SWAP_PARAMS: Route3TraditionalSwapParamsResponse = {
  input: undefined,
  output: undefined,
  hops: [],
  tree: {
    type: Route3TreeNodeType.Empty,
    items: [],
    dexId: null,
    tokenInId: 0,
    tokenOutId: 1,
    tokenInAmount: '0',
    tokenOutAmount: '0',
    width: 0,
    height: 0
  }
};

export const mockSwapState = mockPersistedState<SwapState>({
  swapParams: createEntity(DEFAULT_SWAP_PARAMS),
  dexes: createEntity([]),
  tokens: createEntity([]),
  tokensMetadata: createEntity([])
});

import { createEntity } from '../create-entity';
import { SwapState } from './swap-state';

export const mockSwapState: SwapState = {
  dexes: createEntity([]),
  tokens: createEntity([]),
  swapParams: createEntity({ input: 0, output: 0, chains: [] }),
  swapContract: createEntity(null)
};

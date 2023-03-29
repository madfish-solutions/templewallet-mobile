import { createEntity } from '../create-entity';
import { SwapState } from './swap-state';

export const mockSwapState: SwapState = {
  dexes: createEntity([]),
  tokens: createEntity([]),
  tokensMetadata: createEntity([])
};

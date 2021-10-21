import { createEntity } from '../create-entity';
import { SwapState } from './swap-state';

export const mockSwapState: SwapState = {
  tokenWhitelist: createEntity(Object.assign({}))
};

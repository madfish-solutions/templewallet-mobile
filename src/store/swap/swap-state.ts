import {
  Route3Dex,
  Route3LiquidityBakingParamsResponse,
  Route3SwapParamsResponse,
  Route3Token
} from 'src/interfaces/route3.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

import { DEFAULT_SWAP_PARAMS } from './swap-state.mock';

export interface SwapState {
  swapParams: LoadableEntityState<Route3SwapParamsResponse | Route3LiquidityBakingParamsResponse>;
  dexes: LoadableEntityState<Array<Route3Dex>>;
  tokens: LoadableEntityState<Array<Route3Token>>;
  tokensMetadata: LoadableEntityState<Array<TokenInterface>>;
}

export const route3InitialState: SwapState = {
  swapParams: createEntity(DEFAULT_SWAP_PARAMS),
  dexes: createEntity([]),
  tokens: createEntity([]),
  tokensMetadata: createEntity([])
};

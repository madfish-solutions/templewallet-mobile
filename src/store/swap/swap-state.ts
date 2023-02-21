import {
  Route3ContractInterface,
  Route3Dex,
  Route3SwapParamsResponse,
  Route3Token
} from 'src/interfaces/route3.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface SwapState {
  dexes: LoadableEntityState<Array<Route3Dex>>;
  tokens: LoadableEntityState<Array<Route3Token>>;
  swapParams: LoadableEntityState<Route3SwapParamsResponse>;
  swapContract: LoadableEntityState<Route3ContractInterface | null>;
}

export const route3InitialState: SwapState = {
  dexes: createEntity([]),
  tokens: createEntity([]),
  swapParams: createEntity({ input: 0, output: 0, chains: [] }),
  swapContract: createEntity(null)
};

export interface Route3RootState {
  swap: SwapState;
}

import { Route3Dex } from 'src/interfaces/route3.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface SwapState {
  dexes: LoadableEntityState<Array<Route3Dex>>;
  tokens: LoadableEntityState<Array<TokenInterface>>;
}

export const route3InitialState: SwapState = {
  dexes: createEntity([]),
  tokens: createEntity([])
};

export interface Route3RootState {
  swap: SwapState;
}

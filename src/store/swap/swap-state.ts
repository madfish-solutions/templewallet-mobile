import { Route3Dex, Route3Token } from 'src/interfaces/route3.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface SwapState {
  dexes: LoadableEntityState<Array<Route3Dex>>;
  tokens: LoadableEntityState<Array<Route3Token>>;
}

export const route3InitialState: SwapState = {
  dexes: createEntity([]),
  tokens: createEntity([])
};

export interface Route3RootState {
  swap: SwapState;
}

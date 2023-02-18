import { Route3Dex, Route3SwapParamsResponse, Route3Token } from 'src/interfaces/route3.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface Route3State {
  dexes: LoadableEntityState<Array<Route3Dex>>;
  tokens: LoadableEntityState<Array<Route3Token>>;
  swapParams: LoadableEntityState<Route3SwapParamsResponse>;
}

export const route3InitialState: Route3State = {
  dexes: createEntity([]),
  tokens: createEntity([]),
  swapParams: createEntity({ input: 0, output: 0, chains: [] })
};

export interface Route3RootState {
  route3: Route3State;
}

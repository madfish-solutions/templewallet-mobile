import { BigNumber } from 'bignumber.js';

import { TokenBalanceInterface } from '../../interfaces/token-balance.interface';
import { LoadableEntityState } from '../types';

export interface AssetsState {
  tokens: LoadableEntityState<TokenBalanceInterface[]>;
  tezos: LoadableEntityState<BigNumber>;
}

export const AssetsInitialState: AssetsState = {
  tokens: { data: [], isLoading: false },
  tezos: { data: new BigNumber(0), isLoading: false }
};

export interface AssetsRootState {
  assets: AssetsState;
}

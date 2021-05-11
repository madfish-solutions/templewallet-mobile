import { TokenBalanceInterface } from '../../interfaces/token-balance.interface';
import { LoadableEntityState } from '../types';

export interface AssetsState {
  tokens: LoadableEntityState<TokenBalanceInterface[]>;
  tezos: LoadableEntityState<string>;
}

export const AssetsInitialState: AssetsState = {
  tokens: { data: [], isLoading: false },
  tezos: { data: '0', isLoading: false }
};

export interface AssetsRootState {
  assets: AssetsState;
}

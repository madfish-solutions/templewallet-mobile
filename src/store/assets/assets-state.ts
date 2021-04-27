import { BalanceInterface } from '../../interfaces/balance.interface';
import { LoadableEntityState } from '../types';

export interface TezosState {
  balance?: string;
  error?: string;
}

export interface AssetsState {
  tokens: LoadableEntityState<BalanceInterface[]>;
  tezos?: TezosState;
}

export const AssetsInitialState: AssetsState = {
  tokens: {
    data: [],
    isLoading: false
  }
};

export interface AssetsRootState {
  assets: AssetsState;
}

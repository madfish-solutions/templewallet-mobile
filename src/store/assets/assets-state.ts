import { BalanceInterface } from '../../interfaces/balance.interface';
import { LoadableEntityState } from '../types';

export interface AssetsState {
  tokens: LoadableEntityState<BalanceInterface[]>;
  tezos?: LoadableEntityState<string | undefined>;
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

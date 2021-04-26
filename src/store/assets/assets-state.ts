import BigNumber from 'bignumber.js';

import { AssetInterface } from '../../interfaces/asset.interface';
import { LoadableEntityState } from '../types';

export interface TezosState {
  balance?: BigNumber;
  error?: string;
}

export interface AssetsState {
  tokens: LoadableEntityState<AssetInterface[]>;
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

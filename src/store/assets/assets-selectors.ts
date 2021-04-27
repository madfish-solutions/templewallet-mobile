import { useSelector } from 'react-redux';

import { BalanceInterface } from '../../interfaces/balance.interface';
import { AssetsRootState, TezosState } from './assets-state';

export const useAssetsSelector = () =>
  useSelector<AssetsRootState, BalanceInterface[]>(rootState => rootState.assets.tokens.data);

export const useTezosSelector = () =>
  useSelector<AssetsRootState, TezosState | undefined>(rootState => rootState.assets.tezos);

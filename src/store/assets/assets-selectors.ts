import { useSelector } from 'react-redux';

import { BalanceInterface } from '../../interfaces/balance.interface';
import { AssetsRootState } from './assets-state';

export const useAssetsSelector = () =>
  useSelector<AssetsRootState, BalanceInterface[]>(rootState => rootState.assets.tokens.data);

export const useBalanceSelector = () =>
  useSelector<AssetsRootState, string | undefined>(rootState => rootState.assets.tezos?.data);

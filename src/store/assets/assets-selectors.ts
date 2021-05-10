import { BigNumber } from 'bignumber.js';
import { useSelector } from 'react-redux';

import { TokenBalanceInterface } from '../../interfaces/token-balance.interface';
import { AssetsRootState } from './assets-state';

export const useAssetsSelector = () =>
  useSelector<AssetsRootState, TokenBalanceInterface[]>(rootState => rootState.assets.tokens.data);

export const useBalanceSelector = () =>
  useSelector<AssetsRootState, BigNumber>(rootState => rootState.assets.tezos.data);

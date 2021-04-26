import { useSelector } from 'react-redux';

import { AssetInterface } from '../../interfaces/asset.interface';
import { AssetsRootState, TezosState } from './assets-state';

export const useAssetsSelector = () =>
  useSelector<AssetsRootState, AssetInterface[]>(rootState => rootState.assets.tokens.data);

export const useTezosSelector = () =>
  useSelector<AssetsRootState, TezosState | undefined>(rootState => rootState.assets.tezos);

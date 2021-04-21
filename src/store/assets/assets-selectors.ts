import { useSelector } from 'react-redux';

import { AssetsInterface } from '../../interfaces/assets.interface';
import { AssetsRootState } from './assets-state';

export const useAssetsSelector = () =>
  useSelector<AssetsRootState, AssetsInterface[]>(rootState => rootState.assets.tokens.data);

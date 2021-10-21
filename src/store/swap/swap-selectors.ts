import { useSelector } from 'react-redux';

import { TokenMetadataResponse } from '../../utils/token-metadata.utils';
import { LoadableEntityState } from '../types';
import { SwapRootState } from './swap-state';
export const useSwapTokensWhitelist = () =>
  useSelector<SwapRootState, LoadableEntityState<TokenMetadataResponse[]>>(({ swap }) => swap.tokenWhitelist);

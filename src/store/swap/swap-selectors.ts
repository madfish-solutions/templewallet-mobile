import { useSelector } from 'react-redux';

import { TokenMetadataResponse } from '../../utils/token-metadata.utils';
import { LoadableEntityState } from '../types';
import { SwapRootState } from './swap-state';

export const useSwapTokensWhitelist = () =>
  useSelector<SwapRootState, LoadableEntityState<TokenMetadataResponse[]>>(({ swap }) => swap.tokenWhitelist);

export const useLiquidityBakingAsset = () =>
  useSelector<SwapRootState, TokenMetadataResponse[]>(({ swap }) =>
    swap.tokenWhitelist.data.filter(asset => {
      if (asset.name === 'tzBTC') {
        return asset;
      }
    })
  );

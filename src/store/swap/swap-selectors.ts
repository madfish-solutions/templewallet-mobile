import { useSelector } from 'react-redux';

import { SwapRootState, tokenWhitelistEntry } from './swap-state';
export const useSwapTokensWhitelist = () =>
  useSelector<SwapRootState, tokenWhitelistEntry[]>(({ swap }) => swap.tokenWhitelist.data);

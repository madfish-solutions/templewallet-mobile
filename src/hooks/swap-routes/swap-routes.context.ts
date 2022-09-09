import { createContext } from 'react';
import { BlockInterface } from 'swap-router-sdk';
import { RoutePair } from 'swap-router-sdk/dist/interface/route-pair.interface';

interface SwapRoutesContextValues {
  allRoutePairs: {
    data: RoutePair[];
    block: BlockInterface;
    hasFailed: boolean;
    isRefreshing: boolean;
    onRefresh: () => void;
  } | null;
}

export const SwapRoutesContext = createContext<SwapRoutesContextValues>({
  allRoutePairs: null
});

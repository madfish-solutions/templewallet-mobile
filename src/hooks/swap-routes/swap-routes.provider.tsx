import React, { FC } from 'react';
import { useAllRoutePairs } from 'swap-router-sdk';

import { TEZOS_DEXES_API_URL } from '../../screens/swap/config';
import { SwapRoutesContext } from './swap-routes.context';

export const SwapRoutesProvider: FC = ({ children }) => {
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);

  return <SwapRoutesContext.Provider value={{ allRoutePairs }}>{children}</SwapRoutesContext.Provider>;
};

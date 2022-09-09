import { useContext } from 'react';
import { BlockInterface } from 'swap-router-sdk';

import { SwapRoutesContext } from './swap-routes.context';

export const EMPTY_BLOCK: BlockInterface = {
  protocol: '',
  chain_id: '',
  hash: '',
  header: {
    level: 0,
    timestamp: new Date()
  }
};

export const useSwapRoutes = () => useContext(SwapRoutesContext);

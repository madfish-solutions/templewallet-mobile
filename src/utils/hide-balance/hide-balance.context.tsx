import { createContext } from 'react';

import { emptyFn, EmptyFn } from '../../config/general';

interface HideBalanceContextValues {
  isBalanceHidden: boolean;
  hideSymbol: string;
  hideBalanceHandler: EmptyFn;
}

export const HideBalanceContext = createContext<HideBalanceContextValues>({
  isBalanceHidden: false,
  hideSymbol: '•••••••',
  hideBalanceHandler: emptyFn
});

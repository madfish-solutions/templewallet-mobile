import { createContext, ReactNode } from 'react';

import { emptyFn, EmptyFn } from '../../config/general';

interface HideBalanceContextValues {
  isBalanceHidden: boolean;
  balanceWrapper: (balance: ReactNode | string) => string;
  hideBalanceHandler: EmptyFn;
}

export const HideBalanceContext = createContext<HideBalanceContextValues>({
  isBalanceHidden: false,
  balanceWrapper: () => '',
  hideBalanceHandler: emptyFn
});

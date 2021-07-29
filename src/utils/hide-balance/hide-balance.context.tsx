import { createContext, ReactNode } from 'react';

import { emptyFn, EmptyFn, EventFn } from '../../config/general';

interface HideBalanceContextValues {
  isBalanceHidden: boolean;
  balanceWrapper: EventFn<ReactNode, ReactNode>;
  hideBalanceHandler: EmptyFn;
}

export const HideBalanceContext = createContext<HideBalanceContextValues>({
  isBalanceHidden: false,
  balanceWrapper: () => '',
  hideBalanceHandler: emptyFn
});

import { createContext } from 'react';

import { emptyFn, EmptyFn } from '../../config/general';

interface HideBalanceContextValues {
  isBalanceHidden: boolean;
  toggleHideBalance: EmptyFn;
}

export const HideBalanceContext = createContext<HideBalanceContextValues>({
  isBalanceHidden: false,
  toggleHideBalance: emptyFn
});

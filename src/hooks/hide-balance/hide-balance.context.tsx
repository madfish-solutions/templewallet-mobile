import { createContext } from 'react';

import { emptyFn } from 'src/config/general';

interface HideBalanceContextValues {
  isBalanceHidden: boolean;
  toggleHideBalance: EmptyFn;
}

export const HideBalanceContext = createContext<HideBalanceContextValues>({
  isBalanceHidden: false,
  toggleHideBalance: emptyFn
});

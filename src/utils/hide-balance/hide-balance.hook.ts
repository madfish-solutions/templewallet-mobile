import { useContext } from 'react';

import { HideBalanceContext } from './hide-balance.context';

export const useHideBalance = () => useContext(HideBalanceContext);

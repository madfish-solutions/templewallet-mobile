import React, { FC, ReactNode, useEffect, useState } from 'react';

import { useBalanceHiddenSelector } from '../../store/settings/settings-selectors';
import { HideBalanceContext } from './hide-balance.context';

const hideSymbol = '•••••••';

export const HideBalanceProvider: FC = ({ children }) => {
  const isBalanceHiddenSetting = useBalanceHiddenSelector();
  const [isBalanceHidden, setIsBalanceHidden] = useState(isBalanceHiddenSetting);

  useEffect(() => setIsBalanceHidden(isBalanceHiddenSetting), [isBalanceHiddenSetting]);

  const hideBalanceHandler = () => setIsBalanceHidden(!isBalanceHidden);

  const balanceWrapper = (balance: ReactNode): ReactNode => (!isBalanceHidden ? balance : hideSymbol);

  return (
    <HideBalanceContext.Provider value={{ isBalanceHidden, balanceWrapper, hideBalanceHandler }}>
      {children}
    </HideBalanceContext.Provider>
  );
};

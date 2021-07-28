import React, { FC, ReactNode, useEffect, useState } from 'react';

import { useBalanceHiddenSelector } from '../../store/settings/settings-selectors';
import { HideBalanceContext } from './hide-balance.context';

export const HideBalanceProvider: FC = ({ children }) => {
  const isBalanceHiddenSetting = useBalanceHiddenSelector();
  const [isBalanceHidden, setIsBalanceHidden] = useState(isBalanceHiddenSetting);
  const hideSymbol = '•••••••';

  useEffect(() => {
    setIsBalanceHidden(isBalanceHiddenSetting);
  }, [isBalanceHiddenSetting]);

  const hideBalanceHandler = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const balanceWrapper = (balance: ReactNode): string => (!isBalanceHidden ? balance : hideSymbol) as string;

  return (
    <HideBalanceContext.Provider value={{ isBalanceHidden, balanceWrapper, hideBalanceHandler }}>
      {children}
    </HideBalanceContext.Provider>
  );
};

import React, { FC, useEffect, useState } from 'react';

import { useBalanceHiddenSelector } from '../../store/settings/settings-selectors';
import { HideBalanceContext } from './hide-balance.context';

export const HideBalanceProvider: FC = ({ children }) => {
  const isBalanceHiddenState = useBalanceHiddenSelector();
  const [isBalanceHidden, setIsBalanceHidden] = useState(isBalanceHiddenState);
  const hideSymbol = '•••••••';

  useEffect(() => {
    setIsBalanceHidden(isBalanceHiddenState);
  }, [isBalanceHiddenState]);

  const hideBalanceHandler = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  return (
    <HideBalanceContext.Provider value={{ isBalanceHidden, hideSymbol, hideBalanceHandler }}>
      {children}
    </HideBalanceContext.Provider>
  );
};

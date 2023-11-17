import React, { FC, useEffect, useState } from 'react';

import { useBalanceHiddenSelector } from '../../store/settings/settings-selectors';

import { HideBalanceContext } from './hide-balance.context';

export const HideBalanceProvider: FC = ({ children }) => {
  const isBalanceHiddenSetting = useBalanceHiddenSelector();
  const [isBalanceHidden, setIsBalanceHidden] = useState(isBalanceHiddenSetting);

  useEffect(() => setIsBalanceHidden(isBalanceHiddenSetting), [isBalanceHiddenSetting]);

  const toggleHideBalance = () => setIsBalanceHidden(!isBalanceHidden);

  return (
    <HideBalanceContext.Provider value={{ isBalanceHidden, toggleHideBalance }}>{children}</HideBalanceContext.Provider>
  );
};

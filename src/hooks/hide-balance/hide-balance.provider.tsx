import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useBalanceHiddenSelector } from 'src/store/settings/settings-selectors';

import { HideBalanceContext } from './hide-balance.context';

export const HideBalanceProvider: FCWithChildren = ({ children }) => {
  const isBalanceHiddenSetting = useBalanceHiddenSelector();
  const [isBalanceHidden, setIsBalanceHidden] = useState(isBalanceHiddenSetting);

  useEffect(() => setIsBalanceHidden(isBalanceHiddenSetting), [isBalanceHiddenSetting]);

  const toggleHideBalance = useCallback(() => setIsBalanceHidden(prevValue => !prevValue), []);
  const value = useMemo(() => ({ isBalanceHidden, toggleHideBalance }), [isBalanceHidden, toggleHideBalance]);

  return <HideBalanceContext.Provider value={value}>{children}</HideBalanceContext.Provider>;
};

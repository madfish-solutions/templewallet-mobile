import React, { createContext, FC, useState } from 'react';

import { emptyFn } from '../config/general';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';

type TabBarHeightContextValue = {
  height: number;
  updateHeight: (newValue: number) => void;
};

export const TabBarHeightContext = createContext<TabBarHeightContextValue>({
  height: 0,
  updateHeight: emptyFn
});

export const TabBarHeightProvider: FC = ({ children }) => {
  const [height, updateHeight] = useState(0);
  const isAuthorised = useIsAuthorisedSelector();

  return (
    <TabBarHeightContext.Provider value={{ height: isAuthorised ? height : 0, updateHeight }}>
      {children}
    </TabBarHeightContext.Provider>
  );
};

import React, { FC, useState } from 'react';

import { SlippageToleranceContext } from './slippage-tolerance.context';

export const SlippageToleranceProvider: FC = ({ children }) => {
  const [slippageTolerance, setSlippageTolerance] = useState(0);

  const updateSlippageTolerance = (newValue: number) => {
    setSlippageTolerance(newValue);
  };

  return (
    <SlippageToleranceContext.Provider value={{ slippageTolerance, updateSlippageTolerance }}>
      {children}
    </SlippageToleranceContext.Provider>
  );
};

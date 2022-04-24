import { createContext } from 'react';

import { EventFn } from '../../config/general';

interface SlippegeToleranceContextValues {
  slippageTolerance: number;
  updateSlippageTolerance?: EventFn<number>;
}

export const SlippageToleranceContext = createContext<SlippegeToleranceContextValues>({
  slippageTolerance: 0
});

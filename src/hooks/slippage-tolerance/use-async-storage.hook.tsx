import { useContext } from 'react';

import { SlippageToleranceContext } from './slippage-tolerance.context';

export const useSlippageTolerance = () => useContext(SlippageToleranceContext);

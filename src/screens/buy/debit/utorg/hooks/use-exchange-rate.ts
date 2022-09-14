import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';

import { getExchangeRate } from '../../../../../utils/utorg.utils';

export const useExchangeRate = (inputCurrency: string, inputAmount?: BigNumber) => {
  const [exchangeRate, setExchangeRate] = useState(0);

  const updateExchangeRateRequest = useCallback(() => {
    getExchangeRate(inputCurrency, inputAmount).then(exchangeRate => setExchangeRate(exchangeRate));
  }, [inputAmount, inputCurrency]);

  useEffect(() => {
    updateExchangeRateRequest();
  }, [updateExchangeRateRequest]);

  return exchangeRate;
};

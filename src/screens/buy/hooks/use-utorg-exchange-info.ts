import { useCallback, useEffect, useState } from 'react';

import { getAvailableFiatCurrencies, getMinMaxExchangeValue } from '../../../utils/utorg.utils';

export const useUtorgExchangeInfo = () => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [isError, setIsError] = useState(false);

  const isDisabled = minAmount === 0 || currencies.length === 0 || isError;

  const updateMinMaxRequest = useCallback(() => {
    getMinMaxExchangeValue()
      .then(({ minAmount, maxAmount }) => {
        setMinAmount(minAmount);
        setMaxAmount(maxAmount);
      })
      .catch(() => setIsError(true));
  }, []);

  const updateCurrenciesRequest = useCallback(() => {
    getAvailableFiatCurrencies()
      .then(currencies => {
        setCurrencies(currencies);
      })
      .catch(() => setIsError(true));
  }, []);

  useEffect(() => {
    updateMinMaxRequest();
    updateCurrenciesRequest();
  }, [updateMinMaxRequest, updateCurrenciesRequest]);

  return {
    availableUtorgCurrencies: currencies,
    minUtorgExchangeAmount: minAmount,
    maxUtorgExchangeAmount: maxAmount,
    isUtorgDisabled: isDisabled,
    isUtorgError: isError
  };
};

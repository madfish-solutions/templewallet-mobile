import { useMemo, useState } from 'react';

import { TopUpWithNetworkInterface } from 'src/interfaces/topup.interface';
import { useExolixCurrencies, useExolixCurrenciesLoading } from 'src/store/exolix/exolix-selectors';
import { isString } from 'src/utils/is-string';

export const useFilteredCurrenciesList = () => {
  const allCurrencies = useExolixCurrencies();
  const currenciesLoading = useExolixCurrenciesLoading();
  const [searchValue, setSearchValue] = useState<string>();

  const { inputCurrencies, outputCurrencies } = useMemo(() => {
    const inputCurrencies: TopUpWithNetworkInterface[] = [];
    const outputCurrencies: TopUpWithNetworkInterface[] = [];

    allCurrencies.forEach(currency => {
      if (currency.network.code === 'XTZ') {
        outputCurrencies.push(currency);
      } else {
        inputCurrencies.push(currency);
      }
    });

    return { inputCurrencies, outputCurrencies };
  }, [allCurrencies]);

  const filteredInputCurrenciesList = useMemo(() => {
    const sourceArray = inputCurrencies;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TopUpWithNetworkInterface[] = [];

      for (const asset of sourceArray) {
        const { name, code } = asset;

        if (name.toLowerCase().includes(lowerCaseSearchValue) || code.toLowerCase().includes(lowerCaseSearchValue)) {
          result.push(asset);
        }
      }

      return result;
    } else {
      return sourceArray;
    }
  }, [searchValue, inputCurrencies]);

  return {
    allCurrencies,
    inputCurrencies,
    outputCurrencies,
    currenciesLoading,
    filteredInputCurrenciesList,
    searchValue,
    setSearchValue
  };
};

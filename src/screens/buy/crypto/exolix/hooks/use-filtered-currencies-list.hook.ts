import { useMemo, useState } from 'react';

import { TopUpWithNetworkInterface } from 'src/interfaces/topup.interface';
import { useExolixCurrencies, useExolixCurrenciesLoading } from 'src/store/exolix/exolix-selectors';
import { isString } from 'src/utils/is-string';

import { initialToAsset } from '../config';

export const useFilteredCurrenciesList = () => {
  const allCurrencies = useExolixCurrencies();
  const currenciesLoading = useExolixCurrenciesLoading();
  const [searchValue, setSearchValue] = useState<string>();

  const inputCurrencies = useMemo(
    () => allCurrencies.filter(currency => currency.network.code !== initialToAsset.network.code),
    [allCurrencies]
  );

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
    currenciesLoading,
    filteredInputCurrenciesList,
    searchValue,
    setSearchValue
  };
};

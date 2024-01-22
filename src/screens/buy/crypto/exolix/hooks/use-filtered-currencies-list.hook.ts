import { useMemo, useState } from 'react';

import { TopUpWithNetworkInterface } from 'src/interfaces/topup.interface';
import { useExolixCurrencies } from 'src/store/exolix/exolix-selectors';
import { isString } from 'src/utils/is-string';

export const useFilteredCurrenciesList = () => {
  const currencies = useExolixCurrencies();
  const [searchValue, setSearchValue] = useState<string>();
  const filteredCurrenciesList = useMemo<TopUpWithNetworkInterface[]>(() => {
    const sourceArray = currencies;

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
  }, [searchValue, currencies]);

  return {
    allCurrencies: currencies,
    filteredCurrenciesList,
    searchValue,
    setSearchValue
  };
};

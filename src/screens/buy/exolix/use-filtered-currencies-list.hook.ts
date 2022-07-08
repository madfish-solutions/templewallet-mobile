import { useMemo, useState } from 'react';

import { CurrenciesInterface } from '../../../interfaces/exolix.interface';
import { useExolixCurrencies } from '../../../store/exolix/exolix-selectors';
import { isString } from '../../../utils/is-string';

export const useFilteredCurrenciesList = () => {
  const currencies = useExolixCurrencies();
  const [searchValue, setSearchValue] = useState<string>();
  const filteredCurrenciesList = useMemo<CurrenciesInterface[]>(() => {
    const sourceArray = currencies;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: CurrenciesInterface[] = [];

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
    filteredCurrenciesList,
    searchValue,
    setSearchValue
  };
};

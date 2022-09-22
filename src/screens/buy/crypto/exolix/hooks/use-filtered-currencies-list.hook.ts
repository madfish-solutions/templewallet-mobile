import { useMemo, useState } from 'react';

import { TopUpInputInterface } from '../../../../../interfaces/topup.interface';
import { useExolixCurrencies } from '../../../../../store/exolix/exolix-selectors';
import { isString } from '../../../../../utils/is-string';

export const useFilteredCurrenciesList = () => {
  const currencies = useExolixCurrencies();
  const [searchValue, setSearchValue] = useState<string>();
  const filteredCurrenciesList = useMemo<TopUpInputInterface[]>(() => {
    const sourceArray = currencies;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TopUpInputInterface[] = [];

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

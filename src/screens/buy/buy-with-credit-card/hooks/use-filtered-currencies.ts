import { debounce } from 'lodash-es';
import { useMemo, useState } from 'react';

import { TopUpInputInterface } from 'src/store/buy-with-credit-card/types';

export const useFilteredCurrencies = <T extends TopUpInputInterface>(allCurrencies: T[]) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSetSearchValue = useMemo(() => debounce(setSearchValue, 300), []);

  const filteredCurrencies = useMemo<TopUpInputInterface[]>(() => {
    if (searchValue) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TopUpInputInterface[] = [];

      for (const currency of allCurrencies) {
        if (currency.code.toLowerCase().includes(lowerCaseSearchValue)) {
          result.push(currency);
        }
      }

      return result;
    } else {
      return allCurrencies;
    }
  }, [searchValue, allCurrencies]);

  return {
    filteredCurrencies,
    setSearchValue: debouncedSetSearchValue
  };
};

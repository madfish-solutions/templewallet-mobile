import { debounce } from 'lodash-es';
import { useMemo, useState } from 'react';

import { TopUpInputInterface } from 'src/interfaces/topup.interface';

const UTORG_FIAT_ICONS_BASE_URL = 'https://utorg.pro/img/flags2/icon-';

export const useFilteredCurrencies = (currencies: string[]) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSetSearchValue = debounce(setSearchValue, 300);

  const topUpCurrencies = currencies.map(currencyName => ({
    code: currencyName,
    icon: UTORG_FIAT_ICONS_BASE_URL + currencyName.slice(0, -1) + '.svg',
    name: '',
    network: '',
    networkFullName: ''
  }));

  const filteredCurrencies = useMemo<TopUpInputInterface[]>(() => {
    if (searchValue) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TopUpInputInterface[] = [];

      for (const currency of topUpCurrencies) {
        if (currency.code.toLowerCase().includes(lowerCaseSearchValue)) {
          result.push(currency);
        }
      }

      return result;
    } else {
      return topUpCurrencies;
    }
  }, [searchValue, currencies]);

  return {
    filteredCurrencies,
    setSearchValue: debouncedSetSearchValue
  };
};

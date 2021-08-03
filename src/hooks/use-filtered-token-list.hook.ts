import { useMemo, useState } from 'react';

import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';

export const useFilteredTokenList = (tokensList: TokenInterface[], initialIsHideZeroBalance = false) => {
  const [isHideZeroBalance, setIsHideZeroBalance] = useState(initialIsHideZeroBalance);

  const [searchValue, setSearchValue] = useState<string>();

  const nonZeroBalanceTokenList = useMemo(() => tokensList.filter(({ balance }) => balance !== '0'), [tokensList]);

  const filteredTokensList = useMemo(() => {
    const sourceArray = isHideZeroBalance ? nonZeroBalanceTokenList : tokensList;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const token of sourceArray) {
        const { name, symbol, address } = token;

        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          symbol.toLowerCase().includes(lowerCaseSearchValue) ||
          address.toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(token);
        }
      }

      return result;
    }

    return sourceArray;
  }, [isHideZeroBalance, searchValue, tokensList, nonZeroBalanceTokenList]);

  return {
    filteredTokensList,
    isHideZeroBalance,
    setIsHideZeroBalance,
    searchValue,
    setSearchValue
  };
};

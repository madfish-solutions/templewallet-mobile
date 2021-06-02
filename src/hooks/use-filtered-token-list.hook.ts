import { useEffect, useState } from 'react';

import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';

export const useFilteredTokenList = (tokensList: TokenInterface[]) => {
  const [isHideZeroBalance, setIsHideZeroBalance] = useState(false);
  const [nonZeroBalanceTokenList, setNonZeroBalanceTokenList] = useState<TokenInterface[]>([]);

  const [searchValue, setSearchValue] = useState<string>();
  const [filteredTokensList, setFilteredTokensList] = useState<TokenInterface[]>([]);

  useEffect(() => {
    const result: TokenInterface[] = [];

    for (const token of tokensList) {
      if (token.balance !== '0') {
        result.push(token);
      }
    }

    setNonZeroBalanceTokenList(result);
  }, [tokensList]);

  useEffect(() => {
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

      setFilteredTokensList(result);
    } else {
      setFilteredTokensList(sourceArray);
    }
  }, [isHideZeroBalance, searchValue, tokensList, nonZeroBalanceTokenList]);

  return {
    filteredTokensList,
    isHideZeroBalance,
    setIsHideZeroBalance,
    searchValue,
    setSearchValue
  };
};

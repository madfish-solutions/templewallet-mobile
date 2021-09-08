import { useEffect, useState } from 'react';

import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';

export const useFilteredTokenList = (assetsList: TokenInterface[], initialIsHideZeroBalance = false) => {
  const [isHideZeroBalance, setIsHideZeroBalance] = useState(initialIsHideZeroBalance);
  const [nonZeroBalanceAssetsList, setNonZeroBalanceAssetsList] = useState<TokenInterface[]>([]);

  const [searchValue, setSearchValue] = useState<string>();
  const [filteredAssetsList, setFilteredAssetsList] = useState<TokenInterface[]>([]);

  useEffect(() => {
    const result: TokenInterface[] = [];

    for (const asset of assetsList) {
      if (asset.balance !== '0') {
        result.push(asset);
      }
    }

    setNonZeroBalanceAssetsList(result);
  }, [assetsList]);

  useEffect(() => {
    const sourceArray = isHideZeroBalance ? nonZeroBalanceAssetsList : assetsList;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const asset of sourceArray) {
        const { name, symbol, address } = asset;

        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          symbol.toLowerCase().includes(lowerCaseSearchValue) ||
          address.toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(asset);
        }
      }

      setFilteredAssetsList(result);
    } else {
      setFilteredAssetsList(sourceArray);
    }
  }, [isHideZeroBalance, searchValue, assetsList, nonZeroBalanceAssetsList]);

  return {
    filteredAssetsList,
    isHideZeroBalance,
    setIsHideZeroBalance,
    searchValue,
    setSearchValue
  };
};

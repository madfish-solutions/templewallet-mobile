import { useEffect, useMemo, useState } from 'react';

import { WHITELIST_TOKENS } from '../config/whitelist';
import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';
import { isNonZeroBalance } from '../utils/tezos.util';

export const useFilteredAssetsList = (assetsList: TokenInterface[], initialIsHideZeroBalance = false) => {
  const [isHideZeroBalance, setIsHideZeroBalance] = useState(initialIsHideZeroBalance);
  const [nonZeroBalanceAssetsList, setNonZeroBalanceAssetsList] = useState<TokenInterface[]>([]);

  const [searchValue, setSearchValue] = useState<string>();
  const [filteredAssetsList, setFilteredAssetsList] = useState<TokenInterface[]>([]);

  // TODO: change
  const whitelist = useMemo(() => {
    return [
      ...assetsList,
      ...WHITELIST_TOKENS.filter(x => !assetsList.every(y => y.address === x.address && y.id === x.id))
    ];
  }, [assetsList]);

  useEffect(() => {
    const result: TokenInterface[] = whitelist.filter(asset => isNonZeroBalance(asset));

    setNonZeroBalanceAssetsList(result);
  }, [whitelist]);

  useEffect(() => {
    const sourceArray = isHideZeroBalance ? nonZeroBalanceAssetsList : whitelist;

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
  }, [isHideZeroBalance, searchValue, whitelist, nonZeroBalanceAssetsList]);

  return {
    filteredAssetsList,
    isHideZeroBalance,
    setIsHideZeroBalance,
    searchValue,
    setSearchValue
  };
};

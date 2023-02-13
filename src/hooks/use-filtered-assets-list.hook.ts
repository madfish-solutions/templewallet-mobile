import { useMemo, useState } from 'react';

import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isString } from 'src/utils/is-string';
import { isNonZeroBalance } from 'src/utils/tezos.util';

export const useFilteredAssetsList = (assetsList: TokenInterface[], isHideZeroBalance = false) => {
  const nonZeroBalanceAssetsList = useMemo<TokenInterface[]>(
    () => assetsList.filter(asset => isNonZeroBalance(asset)),
    [assetsList]
  );

  const [searchValue, setSearchValue] = useState<string>();
  const filteredAssetsList = useMemo<TokenInterface[]>(() => {
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

      return result;
    } else {
      return sourceArray;
    }
  }, [isHideZeroBalance, searchValue, assetsList, nonZeroBalanceAssetsList]);

  return {
    filteredAssetsList,
    isHideZeroBalance,
    searchValue,
    setSearchValue
  };
};

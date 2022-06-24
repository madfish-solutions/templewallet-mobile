import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setZeroBalancesShown } from '../store/settings/settings-actions';
import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';
import { isNonZeroBalance } from '../utils/tezos.util';

export const useFilteredAssetsList = (assetsList: TokenInterface[], isHideZeroBalance = false) => {
  const dispatch = useDispatch();
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

  const handleHideZeroBalanceChange = useCallback((value: boolean) => {
    dispatch(setZeroBalancesShown(value));
  }, []);

  return {
    filteredAssetsList,
    isHideZeroBalance,
    setIsHideZeroBalance: handleHideZeroBalanceChange,
    searchValue,
    setSearchValue
  };
};

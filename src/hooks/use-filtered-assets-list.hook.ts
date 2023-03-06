import { BigNumber } from 'bignumber.js';
import { useMemo, useState } from 'react';

import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getDollarValue } from 'src/utils/balance.utils';
import { isString } from 'src/utils/is-string';
import { isTruthy } from 'src/utils/is-truthy';
import { isNonZeroBalance } from 'src/utils/tezos.util';

export const useFilteredAssetsList = (
  assetsList: TokenInterface[],
  isHideZeroBalance = false,
  sortByDollarValueDecrease = false
) => {
  const nonZeroBalanceAssetsList = useMemo<TokenInterface[]>(
    () => assetsList.filter(asset => isNonZeroBalance(asset)),
    [assetsList]
  );

  const [searchValue, setSearchValue] = useState<string>();

  const filteredAssetsList = useMemo<TokenInterface[]>(() => {
    const sourceArray = isHideZeroBalance ? nonZeroBalanceAssetsList : assetsList;

    if (!isString(searchValue)) {
      return sortByDollarValueDecrease ? applySortByDollarValueDecrease([...sourceArray]) : sourceArray;
    }

    const lowerCaseSearchValue = searchValue.toLowerCase();

    const result = sourceArray.filter(
      ({ name, symbol, address }) =>
        name.toLowerCase().includes(lowerCaseSearchValue) ||
        symbol.toLowerCase().includes(lowerCaseSearchValue) ||
        address.toLowerCase().includes(lowerCaseSearchValue)
    );

    return sortByDollarValueDecrease ? applySortByDollarValueDecrease(result) : sourceArray;
  }, [searchValue, assetsList, nonZeroBalanceAssetsList, isHideZeroBalance, sortByDollarValueDecrease]);

  return {
    filteredAssetsList,
    searchValue,
    setSearchValue
  };
};

const applySortByDollarValueDecrease = (assets: TokenInterface[]) =>
  assets.sort((a, b) => {
    const aDollarValue = isTruthy(a.exchangeRate) ? getDollarValue(a.balance, a, a.exchangeRate) : BigNumber(0);
    const bDollarValue = isTruthy(b.exchangeRate) ? getDollarValue(b.balance, b, b.exchangeRate) : BigNumber(0);

    return aDollarValue.eq(bDollarValue) ? 0 : aDollarValue.gt(bDollarValue) ? -1 : 1;
  });

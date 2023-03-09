import { BigNumber } from 'bignumber.js';
import { useMemo, useState } from 'react';

import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getDollarValue } from 'src/utils/balance.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { isTruthy } from 'src/utils/is-truthy';
import { isNonZeroBalance } from 'src/utils/tezos.util';

export const useFilteredAssetsList = (
  assetsList: TokenInterface[],
  filterZeroBalances = false,
  sortByDollarValueDecrease = false,
  leadingAsset?: TokenInterface,
  leadingAssetIsSearchable = true
) => {
  const sourceArray = useMemo<TokenInterface[]>(
    () => (filterZeroBalances ? assetsList.filter(asset => isNonZeroBalance(asset)) : assetsList),
    [assetsList, filterZeroBalances]
  );

  const [searchValue, setSearchValue] = useState<string>();

  const searchedAssetsList = useMemo<TokenInterface[]>(() => {
    if (!isString(searchValue)) {
      return sortByDollarValueDecrease ? applySortByDollarValueDecrease([...sourceArray]) : sourceArray;
    }

    const lowerCaseSearchValue = searchValue.toLowerCase();

    const result = sourceArray.filter(asset => isAssetSearched(asset, lowerCaseSearchValue));

    return sortByDollarValueDecrease ? applySortByDollarValueDecrease(result) : sourceArray;
  }, [searchValue, sourceArray, sortByDollarValueDecrease]);

  const filteredAssetsList = useMemo(() => {
    if (
      !isDefined(leadingAsset) ||
      (leadingAssetIsSearchable && isString(searchValue) && !isAssetSearched(leadingAsset, searchValue.toLowerCase()))
    ) {
      return searchedAssetsList;
    }

    return [leadingAsset, ...searchedAssetsList];
  }, [searchedAssetsList, leadingAsset]);

  return {
    filteredAssetsList,
    searchValue,
    setSearchValue
  };
};

const isAssetSearched = ({ name, symbol, address }: TokenInterface, lowerCaseSearchValue: string) =>
  name.toLowerCase().includes(lowerCaseSearchValue) ||
  symbol.toLowerCase().includes(lowerCaseSearchValue) ||
  address.toLowerCase().includes(lowerCaseSearchValue);

const applySortByDollarValueDecrease = (assets: TokenInterface[]) =>
  assets.sort((a, b) => {
    const aDollarValue = isTruthy(a.exchangeRate) ? getDollarValue(a.balance, a, a.exchangeRate) : BigNumber(0);
    const bDollarValue = isTruthy(b.exchangeRate) ? getDollarValue(b.balance, b, b.exchangeRate) : BigNumber(0);

    return bDollarValue.minus(aDollarValue).toNumber();
  });

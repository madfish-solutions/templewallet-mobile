import { uniqBy } from 'lodash-es';
import { useMemo, useState } from 'react';

import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { isNonZeroBalance } from 'src/utils/tezos.util';
import { applySortByDollarValueDecrease, isAssetSearched } from 'src/utils/token-metadata.utils';

type FilterableAsset = Pick<
  TokenInterface,
  'address' | 'id' | 'decimals' | 'symbol' | 'name' | 'balance' | 'exchangeRate'
>;

export const useFilteredAssetsList = <T extends FilterableAsset>(
  assetsList: T[],
  filterZeroBalances = false,
  sortByDollarValueDecrease = false,
  leadingAssets?: T[],
  leadingAssetsAreFilterable = true
) => {
  const sourceArray = useMemo(
    () => (filterZeroBalances ? assetsList.filter(asset => isNonZeroBalance(asset)) : assetsList),
    [assetsList, filterZeroBalances]
  );

  const [searchValue, setSearchValue] = useState<string>();

  const searchedAssetsList = useMemo(() => {
    if (!isString(searchValue)) {
      return sortByDollarValueDecrease ? applySortByDollarValueDecrease([...sourceArray]) : sourceArray;
    }

    const lowerCaseSearchValue = searchValue.toLowerCase();

    const result = sourceArray.filter(asset => isAssetSearched(asset, lowerCaseSearchValue));

    return sortByDollarValueDecrease ? applySortByDollarValueDecrease(result) : result;
  }, [searchValue, sourceArray, sortByDollarValueDecrease]);

  const filteredAssetsList = useMemo<T[]>(() => {
    if (!isDefined(leadingAssets)) {
      return searchedAssetsList;
    }

    if (leadingAssetsAreFilterable) {
      if (filterZeroBalances && leadingAssets.every(asset => !isNonZeroBalance(asset))) {
        return searchedAssetsList;
      }
      const searchValueLowercased = searchValue?.toLowerCase();
      if (
        isString(searchValueLowercased) &&
        leadingAssets.every(asset => !isAssetSearched(asset, searchValueLowercased))
      ) {
        return searchedAssetsList;
      }
    }

    return uniqBy([...leadingAssets, ...searchedAssetsList], getTokenSlug);
  }, [searchedAssetsList, searchValue, filterZeroBalances, leadingAssets, leadingAssetsAreFilterable]);

  return {
    filteredAssetsList,
    searchValue,
    setSearchValue
  };
};

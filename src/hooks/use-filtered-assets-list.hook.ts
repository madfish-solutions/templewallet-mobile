import { uniqBy } from 'lodash-es';
import { useMemo, useState } from 'react';

import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { isNonZeroBalance } from 'src/utils/tezos.util';
import { applySortByDollarValueDecrease, isAssetSearched } from 'src/utils/token-metadata.utils';

export const useFilteredAssetsList = (
  assetsList: TokenInterface[],
  filterZeroBalances = false,
  sortByDollarValueDecrease = false,
  leadingAsset?: TokenInterface,
  leadingAssetIsFilterable = true
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

    return sortByDollarValueDecrease ? applySortByDollarValueDecrease(result) : result;
  }, [searchValue, sourceArray, sortByDollarValueDecrease]);

  const filteredAssetsList = useMemo(() => {
    if (!isDefined(leadingAsset)) {
      return searchedAssetsList;
    }

    if (leadingAssetIsFilterable) {
      if (filterZeroBalances && !isNonZeroBalance(leadingAsset)) {
        return searchedAssetsList;
      }
      if (isString(searchValue) && !isAssetSearched(leadingAsset, searchValue.toLowerCase())) {
        return searchedAssetsList;
      }
    }

    return uniqBy([leadingAsset, ...searchedAssetsList], getTokenSlug);
  }, [searchedAssetsList, searchValue, filterZeroBalances, leadingAsset, leadingAssetIsFilterable]);

  return {
    filteredAssetsList,
    searchValue,
    setSearchValue
  };
};

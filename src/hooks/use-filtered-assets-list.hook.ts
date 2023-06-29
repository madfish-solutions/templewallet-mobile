import { useMemo, useState } from 'react';

import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { isNonZeroBalance } from 'src/utils/tezos.util';
import { applySortByDollarValueDecrease, isAssetSearched } from 'src/utils/token-metadata.utils';

export const useFilteredAssetsList = (
  assetsList: TokenInterface[],
  filterZeroBalances = false,
  sortByDollarValueDecrease = false,
  leadingAssets?: Array<TokenInterface>,
  leadingAssetsAreFilterable = true
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
    if (!isDefined(leadingAssets)) {
      return searchedAssetsList;
    }

    if (leadingAssetsAreFilterable) {
      if (filterZeroBalances && leadingAssets.every(asset => isNonZeroBalance(asset))) {
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

    const result = [...leadingAssets, ...searchedAssetsList];

    return result.filter((asset, i) => {
      const slug = toTokenSlug(asset.address, asset.id);
      const firstIndex = result.findIndex(({ address, id }) => toTokenSlug(address, id) === slug);

      return firstIndex === i;
    });
  }, [searchedAssetsList, searchValue, filterZeroBalances, leadingAssets, leadingAssetsAreFilterable]);

  return {
    filteredAssetsList,
    searchValue,
    setSearchValue
  };
};

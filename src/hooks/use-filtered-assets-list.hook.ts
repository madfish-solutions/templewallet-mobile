import { uniqBy } from 'lodash-es';
import { useMemo, useState } from 'react';

import { AssetInterface } from 'src/interfaces/asset.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { isNonZeroBalance } from 'src/utils/tezos.util';
import { applySortByDollarValueDecrease, isAssetSearched } from 'src/utils/token-metadata.utils';

interface FilterableAsset extends Pick<AssetInterface, 'decimals' | 'symbol' | 'name' | 'balance' | 'exchangeRate'> {
  address?: string;
  assetKey?: string;
  assetSlug?: string;
  id?: number;
}

const isFilteredAssetSearched = (asset: FilterableAsset, searchValue: string) =>
  isAssetSearched({ ...asset, address: asset.address ?? asset.assetSlug }, searchValue);

const getFilteredAssetKey = (asset: FilterableAsset) =>
  asset.assetKey ?? (asset.address ? getTokenSlug({ address: asset.address, id: asset.id ?? 0 }) : asset.assetSlug);

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

    const result = sourceArray.filter(asset => isFilteredAssetSearched(asset, lowerCaseSearchValue));

    return sortByDollarValueDecrease ? applySortByDollarValueDecrease(result) : result;
  }, [searchValue, sourceArray, sortByDollarValueDecrease]);

  const filteredAssetsList = useMemo<T[]>(() => {
    if (!isDefined(leadingAssets)) {
      return searchedAssetsList;
    }

    let filteredLeadingAssets: T[] = leadingAssets;

    if (leadingAssetsAreFilterable) {
      if (filterZeroBalances) {
        filteredLeadingAssets = filteredLeadingAssets.filter(asset => isNonZeroBalance(asset));
      }

      const searchValueLowercased = searchValue?.toLowerCase();
      if (isString(searchValueLowercased)) {
        filteredLeadingAssets = filteredLeadingAssets.filter(asset =>
          isFilteredAssetSearched(asset, searchValueLowercased)
        );
      }
    }

    return uniqBy([...filteredLeadingAssets, ...searchedAssetsList], getFilteredAssetKey);
  }, [searchedAssetsList, searchValue, filterZeroBalances, leadingAssets, leadingAssetsAreFilterable]);

  return {
    filteredAssetsList,
    searchValue,
    setSearchValue
  };
};

import { useMemo, useState } from 'react';

import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { isNonZeroBalance } from 'src/utils/tezos.util';
import { applySortByDollarValueDecrease, isAssetSearched } from 'src/utils/token-metadata.utils';

interface useFiltredAssetsListTypes {
  <T extends TokenInterface>(
    assetList: T[],
    filterZeroBalances?: boolean,
    sortByDollarValueDecrease?: boolean,
    leadingAsset?: T,
    leadingAssetIsFilterable?: boolean
  ): {
    filteredAssetsList: T[];
    searchValue: string | undefined;
    setSearchValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  };
}

export const useFilteredAssetsList: useFiltredAssetsListTypes = (
  assetsList,
  filterZeroBalances = false,
  sortByDollarValueDecrease = false,
  leadingAsset?,
  leadingAssetIsFilterable = true
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

    return [leadingAsset, ...searchedAssetsList];
  }, [searchedAssetsList, searchValue, filterZeroBalances, leadingAsset, leadingAssetIsFilterable]);

  return {
    filteredAssetsList,
    searchValue,
    setSearchValue
  };
};

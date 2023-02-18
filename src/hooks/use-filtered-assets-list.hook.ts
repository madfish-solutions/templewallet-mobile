import { useMemo, useState } from 'react';

import { useRoute3TokensSlugsSelector } from 'src/store/route3/route3-selectors';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';
import { isNonZeroBalance } from '../utils/tezos.util';

export const useFilteredAssetsList = (assetsList: TokenInterface[], isHideZeroBalance = false) => {
  const route3TokensSlugs = useRoute3TokensSlugsSelector();

  const assetListRoute3Join = useMemo(
    () => assetsList.filter(asset => route3TokensSlugs.includes(toTokenSlug(asset.address, asset.id))),
    [route3TokensSlugs]
  );
  const nonZeroBalanceAssetsList = useMemo<TokenInterface[]>(
    () => assetListRoute3Join.filter(asset => isNonZeroBalance(asset)),
    [assetsList]
  );

  const [searchValue, setSearchValue] = useState<string>();
  const filteredAssetsList = useMemo<TokenInterface[]>(() => {
    const sourceArray = isHideZeroBalance ? nonZeroBalanceAssetsList : assetListRoute3Join;

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

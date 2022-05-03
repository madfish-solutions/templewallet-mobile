import { useEffect, useState } from 'react';

import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';

export const useSearchAssets = <T>(
  assetsList: TokenInterface[],
  setAssetList: (tokens: Array<TokenInterface>) => void,
  dependencies: Array<T>
) => {
  const [searchValue, setSearchValue] = useState<string>();

  useEffect(() => {
    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const asset of assetsList) {
        const { name, symbol, address } = asset;

        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          symbol.toLowerCase().includes(lowerCaseSearchValue) ||
          address.toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(asset);
        }
      }

      setAssetList(result);
    } else {
      setAssetList(assetsList);
    }
  }, [searchValue, assetsList, ...dependencies]);

  return {
    searchValue,
    setSearchValue
  };
};

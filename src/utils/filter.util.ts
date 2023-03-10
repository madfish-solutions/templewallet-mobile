import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { isSearchValueIncluded } from './is-search-value-included.util';
import { isString } from './is-string';

export const filterTezos = (
  tezosBalance: string,
  isHideZeroBalance: boolean,
  gasTokenMetadata: TokenMetadataInterface,
  searchValue?: string
) => {
  if (isHideZeroBalance && tezosBalance === '0') {
    return false;
  }

  if (isString(searchValue)) {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    const { name, symbol } = gasTokenMetadata;

    if (!isSearchValueIncluded(lowerCaseSearchValue, name.toLowerCase(), symbol.toLowerCase())) {
      return false;
    }
  }

  return true;
};

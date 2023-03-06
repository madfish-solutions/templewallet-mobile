import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';

import { isString } from './is-string';

export const shouldFilterTezos = (
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

    if (!(name.toLowerCase().includes(lowerCaseSearchValue) || symbol.toLowerCase().includes(lowerCaseSearchValue))) {
      return false;
    }
  }

  return true;
};

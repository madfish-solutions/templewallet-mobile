import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { isString } from './is-string';

export const filterTezos = (
  tezosBalance: string,
  isHideZeroBalance: boolean,
  metadata: TokenMetadataInterface,
  searchValue?: string
) => {
  if (isHideZeroBalance && tezosBalance === '0') {
    return false;
  }

  if (isString(searchValue)) {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    const { name, symbol } = metadata;

    if (!(name.toLowerCase().includes(lowerCaseSearchValue) || symbol.toLowerCase().includes(lowerCaseSearchValue))) {
      return false;
    }
  }

  return true;
};

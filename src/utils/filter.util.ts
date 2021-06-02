import { XTZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { isString } from './is-string';

export const filterTezos = (tezosBalance: string, isHideZeroBalance: boolean, searchValue?: string) => {
  if (isHideZeroBalance && tezosBalance === '0') {
    return false;
  }

  if (isString(searchValue)) {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    const { name, symbol } = XTZ_TOKEN_METADATA;

    if (!(name.toLowerCase().includes(lowerCaseSearchValue) || symbol.toLowerCase().includes(lowerCaseSearchValue))) {
      return false;
    }
  }

  return true;
};

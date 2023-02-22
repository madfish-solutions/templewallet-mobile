import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { isDefined } from 'src/utils/is-defined';

import { DropdownEqualityFn } from '../dropdown/dropdown';

export const tokenEqualityFn: DropdownEqualityFn<TokenMetadataInterface> = (item, value) => {
  if (!isDefined(value)) {
    return false;
  }

  if (!item.address && !value.address) {
    return item.symbol === value.symbol;
  }

  return item.address === value.address && item.id === value.id;
};

import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { isDefined } from 'src/utils/is-defined';

import { DropdownEqualityFn } from '../dropdown/dropdown';

export const tokenEqualityFn: DropdownEqualityFn<TokenMetadataInterface> = (item, value) =>
  isDefined(value) && item.address === value.address && item.id === value.id;

import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { isDefined } from '../../utils/is-defined';
import { DropdownEqualityFn } from '../dropdown/dropdown';

export const tokenEqualityFn: DropdownEqualityFn<TokenMetadataInterface> = (item, value) =>
  isDefined(value) && item.name === value.name && item.symbol === value.symbol;

import { isDefined } from '../../utils/is-defined';
import { DropdownEqualityFn } from '../dropdown/dropdown';

export const quoteEqualityFn: DropdownEqualityFn<string> = (item, value) => isDefined(value) && item === value;

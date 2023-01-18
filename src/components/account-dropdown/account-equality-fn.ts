import { IAccountBase } from '../../interfaces/account.interface';
import { isDefined } from '../../utils/is-defined';
import { DropdownEqualityFn } from '../dropdown/dropdown';

export const accountEqualityFn: DropdownEqualityFn<IAccountBase> = (item, value) =>
  isDefined(value) && item.publicKeyHash === value.publicKeyHash;

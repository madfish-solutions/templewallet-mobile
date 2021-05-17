import { AccountInterface } from '../../interfaces/account.interface';
import { isDefined } from '../../utils/is-defined';
import { DropdownEqualityFn } from '../dropdown/dropdown';

export const accountEqualityFn: DropdownEqualityFn<AccountInterface> = (item, value) =>
  isDefined(value) && item.publicKeyHash === value.publicKeyHash;

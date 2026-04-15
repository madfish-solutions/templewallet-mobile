import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { isDefined } from 'src/utils/is-defined';

import { DropdownEqualityFn } from '../dropdown/dropdown';

export const accountEqualityFn: DropdownEqualityFn<AccountBaseInterface> = (item, value) =>
  isDefined(value) && item.publicKeyHash === value.publicKeyHash;

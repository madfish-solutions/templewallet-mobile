import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { getAccountBaseDisplayAddress, getAccountBaseId } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';

import { DropdownEqualityFn } from '../dropdown/dropdown';

export const accountEqualityFn: DropdownEqualityFn<AccountBaseInterface> = (item, value) =>
  isDefined(value) &&
  (getAccountBaseId(item) && getAccountBaseId(value)
    ? getAccountBaseId(item) === getAccountBaseId(value)
    : getAccountBaseDisplayAddress(item) === getAccountBaseDisplayAddress(value));

import { Account } from 'src/interfaces/account.interfaces';

import { DropdownEqualityFn } from '../dropdown/dropdown';

export const accountEqualityFn: DropdownEqualityFn<Account> = (item, value) => item.id === value?.id;

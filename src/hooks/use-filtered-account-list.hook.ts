import { debounce } from 'lodash-es';
import { useEffect, useState } from 'react';

import { AccountInterface } from '../interfaces/account.interface';
import { getAccountBaseDisplayAddress, getAccountId } from '../utils/account.utils';
import { isString } from '../utils/is-string';

export const useFilteredAccountList = (accountList: AccountInterface[]) => {
  const [searchValue, setSearchValue] = useState<string>();

  const [filteredAccountList, setFilteredAccountList] = useState<AccountInterface[]>(accountList);

  useEffect(() => {
    const result: AccountInterface[] = [];

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();

      for (const account of accountList) {
        const { name, publicKey } = account;
        const displayAddress = getAccountBaseDisplayAddress(account);
        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          publicKey.toLowerCase().includes(lowerCaseSearchValue) ||
          displayAddress.toLowerCase().includes(lowerCaseSearchValue) ||
          getAccountId(account).toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(account);
        }
      }

      setFilteredAccountList(result);
    } else {
      setFilteredAccountList(accountList);
    }
  }, [searchValue, accountList]);

  const debouncedSetSearch = debounce(setSearchValue);

  return {
    filteredAccountList,
    debouncedSetSearch
  };
};

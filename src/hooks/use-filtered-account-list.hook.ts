import { debounce } from 'lodash-es';
import { useEffect, useState } from 'react';

import { Account } from '../interfaces/account.interfaces';
import { getAccountBaseDisplayAddress } from '../utils/account.utils';
import { isString } from '../utils/is-string';

export const useFilteredAccountList = (accountList: Account[]) => {
  const [searchValue, setSearchValue] = useState<string>();

  const [filteredAccountList, setFilteredAccountList] = useState<Account[]>(accountList);

  useEffect(() => {
    const result: Account[] = [];

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();

      for (const account of accountList) {
        const { name } = account;
        const displayAddress = getAccountBaseDisplayAddress(account);
        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          displayAddress.toLowerCase().includes(lowerCaseSearchValue)
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

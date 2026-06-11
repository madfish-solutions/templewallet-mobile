import { debounce } from 'lodash-es';
import { useEffect, useState } from 'react';

import { Account } from 'src/interfaces/account.interfaces';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils.ts';
import { isString } from 'src/utils/is-string';

export const useFilteredAccountList = (accountList: Account[]) => {
  const [searchValue, setSearchValue] = useState<string>();

  const [filteredAccountList, setFilteredAccountList] = useState<Account[]>(accountList);

  useEffect(() => {
    const result: Account[] = [];

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();

      for (const account of accountList) {
        const { name } = account;
        const tezosAddress = getAccountAddressForTezos(account);
        const evmAddress = getAccountAddressForEvm(account);

        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          tezosAddress?.toLowerCase().includes(lowerCaseSearchValue) ||
          evmAddress?.toLowerCase().includes(lowerCaseSearchValue)
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

import { debounce } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { WalletAccountInterface } from '../interfaces/wallet-account.interface';
import { isString } from '../utils/is-string';

export const useFilteredAccountList = (accountList: WalletAccountInterface[]) => {
  const [searchValue, setSearchValue] = useState<string>();

  const accountListMemo = useMemo(() => accountList, [accountList]);

  const [filteredAccountList, setFilteredAccountList] = useState<WalletAccountInterface[]>(accountListMemo);

  useEffect(() => {
    const result: WalletAccountInterface[] = [];

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();

      for (const account of accountList) {
        const { name, publicKey, publicKeyHash } = account;
        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          publicKey.toLowerCase().includes(lowerCaseSearchValue) ||
          publicKeyHash.toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(account);
        }
      }

      setFilteredAccountList(result);
    } else {
      setFilteredAccountList(accountList);
    }
  }, [searchValue]);

  const debouncedSetSearch = debounce(setSearchValue);

  return {
    filteredAccountList,
    debouncedSetSearch,
    setSearchValue
  };
};

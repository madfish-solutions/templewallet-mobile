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
        const { name } = account;
        if (name.toLowerCase().includes(lowerCaseSearchValue)) {
          result.push(account);
        }
      }

      setFilteredAccountList(result);
    } else {
      setFilteredAccountList(accountList);
    }
  }, [searchValue]);

  return {
    filteredAccountList,
    searchValue,
    setSearchValue
  };
};

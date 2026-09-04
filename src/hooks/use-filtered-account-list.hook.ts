import { useMemo, useState } from 'react';

import { Account } from 'src/interfaces/account.interfaces';
import { useGetSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors';
import { accountMatchesSearch } from 'src/utils/account.utils.ts';
import { isString } from 'src/utils/is-string';

export const useFilteredAccountList = (accountList: Account[]) => {
  const [searchValue, setSearchValue] = useState<string>();
  const getSaplingAddressForAccount = useGetSaplingAddressForAccount();

  const filteredAccountList = useMemo(
    () =>
      isString(searchValue)
        ? accountList.filter(account =>
            accountMatchesSearch(account, searchValue, getSaplingAddressForAccount(account))
          )
        : accountList,
    [accountList, getSaplingAddressForAccount, searchValue]
  );

  return {
    filteredAccountList,
    setSearchValue
  };
};

import { useMemo, useState } from 'react';

import { Account } from 'src/interfaces/account.interfaces.ts';
import { useGetSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors.ts';
import { accountMatchesSearch } from 'src/utils/account.utils.ts';
import { isString } from 'src/utils/is-string.ts';

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

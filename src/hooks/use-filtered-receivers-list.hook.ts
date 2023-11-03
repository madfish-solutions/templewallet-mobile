import { useMemo, useState } from 'react';

import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { useCurrentAccountPkhSelector, useVisibleAccountsListSelector } from 'src/store/wallet/wallet-selectors';

export const useFilteredReceiversList = () => {
  const contacts = useContactsSelector();
  const accountPkh = useCurrentAccountPkhSelector();

  const allVisibleAccounts = useVisibleAccountsListSelector();

  const myVisibleAccounts = useMemo(
    () =>
      allVisibleAccounts
        .filter(({ publicKeyHash }) => publicKeyHash !== accountPkh)
        .map(({ name, publicKeyHash }) => ({ name, publicKeyHash })),
    [allVisibleAccounts, accountPkh]
  );

  const [searchValue, setSearchValue] = useState<string>('');

  const filteredReceiversList = useMemo(() => {
    const result: Array<SectionDropdownDataInterface<AccountBaseInterface>> = [];

    const searchValueLowerCase = searchValue.toLowerCase();

    const filteredAccounts = myVisibleAccounts.filter(
      ({ name, publicKeyHash }) =>
        name.toLowerCase().includes(searchValueLowerCase) || publicKeyHash.toLowerCase().includes(searchValueLowerCase)
    );

    if (filteredAccounts.length > 0) {
      result.push({ title: 'MY ACCOUNTS', data: filteredAccounts });
    }

    const filteredContacts = contacts.filter(
      ({ name, publicKeyHash }) =>
        name.toLowerCase().includes(searchValueLowerCase) || publicKeyHash.toLowerCase().includes(searchValueLowerCase)
    );

    if (filteredContacts.length > 0) {
      result.push({ title: 'CONTACTS', data: filteredContacts });
    }

    return result;
  }, [contacts, myVisibleAccounts, searchValue]);

  const handleSearchValueChange = (value: string) => setSearchValue(value);

  return {
    filteredReceiversList,
    handleSearchValueChange
  };
};

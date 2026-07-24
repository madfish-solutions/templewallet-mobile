import { useMemo, useState } from 'react';
import { isAddress as isEvmAddress } from 'viem';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { SendReceiver } from 'src/interfaces/send-receiver.interface';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { useAllVisibleAccounts } from 'src/store/wallet/wallet-selectors';
import { getAccountAddressForChain } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';
import { isSaplingAddress } from 'src/utils/sapling/address-utils';
import { isValidAddress } from 'src/utils/tezos.util';

const isImportedAccount = (type: AccountTypeEnum) =>
  type === AccountTypeEnum.IMPORTED_CHAIN || type === AccountTypeEnum.IMPORTED_MULTICHAIN;

export const useFilteredReceiversList = (chainKind: TempleChainKind, sourceAddress?: string) => {
  const contacts = useContactsSelector();
  const allVisibleAccounts = useAllVisibleAccounts();

  const myVisibleAccounts = useMemo(
    () =>
      allVisibleAccounts
        .map(account => {
          const address = getAccountAddressForChain(account, chainKind);

          return address
            ? { name: account.name, address, accountId: account.id, isImported: isImportedAccount(account.type) }
            : undefined;
        })
        .filter(isDefined)
        .filter(({ address }) => address !== sourceAddress),
    [allVisibleAccounts, chainKind, sourceAddress]
  );

  const [searchValue, setSearchValue] = useState<string>('');

  const filteredReceiversList = useMemo(() => {
    const result: Array<SectionDropdownDataInterface<SendReceiver>> = [];

    const searchValueLowerCase = searchValue.toLowerCase();

    const filteredAccounts = myVisibleAccounts.filter(
      ({ name, address }) =>
        name.toLowerCase().includes(searchValueLowerCase) || address.toLowerCase().includes(searchValueLowerCase)
    );

    const createdAccounts = filteredAccounts.filter(({ isImported }) => !isImported);
    const importedAccounts = filteredAccounts.filter(({ isImported }) => isImported);

    if (createdAccounts.length > 0) {
      result.push({ title: 'CREATED', data: createdAccounts });
    }

    if (importedAccounts.length > 0) {
      result.push({ title: 'IMPORTED', data: importedAccounts });
    }

    const filteredContacts = contacts
      .filter(({ address }) =>
        chainKind === TempleChainKind.EVM ? isEvmAddress(address) : isValidAddress(address) || isSaplingAddress(address)
      )
      .filter(
        ({ name, address }) =>
          name.toLowerCase().includes(searchValueLowerCase) || address.toLowerCase().includes(searchValueLowerCase)
      );

    if (filteredContacts.length > 0) {
      result.push({ title: 'CONTACTS', data: filteredContacts });
    }

    return result;
  }, [chainKind, contacts, myVisibleAccounts, searchValue]);

  const handleSearchValueChange = (value: string) => setSearchValue(value);

  return {
    filteredReceiversList,
    handleSearchValueChange
  };
};

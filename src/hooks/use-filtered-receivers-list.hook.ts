import { useMemo, useState } from 'react';
import { isAddress as isEvmAddress } from 'viem';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Contact } from 'src/interfaces/contact.interface';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { AccountReceiver, ContactReceiver, SendReceiver } from 'src/interfaces/send-receiver.interface';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { useGetSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors';
import { useAllVisibleAccounts } from 'src/store/wallet/wallet-selectors';
import { getAccountAddressForChain } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';
import { isSaplingAddress } from 'src/utils/sapling/address-utils';
import { isValidAddress } from 'src/utils/tezos.util';

const isImportedAccount = (type: AccountTypeEnum) =>
  type === AccountTypeEnum.IMPORTED_CHAIN || type === AccountTypeEnum.IMPORTED_MULTICHAIN;

const toContactReceiver = (contact: Contact): ContactReceiver => ({ ...contact, kind: 'contact' });

export const useFilteredReceiversList = (chainKind: TempleChainKind, sourceAddress?: string, isShieldedTez = false) => {
  const contacts = useContactsSelector();
  const allVisibleAccounts = useAllVisibleAccounts();
  const getSaplingAddressForAccount = useGetSaplingAddressForAccount();

  const myVisibleAccounts = useMemo(
    () =>
      allVisibleAccounts
        .map(account => {
          const address = isShieldedTez
            ? getSaplingAddressForAccount(account)
            : getAccountAddressForChain(account, chainKind);

          return address
            ? ({ kind: 'account', name: account.name, address, account } satisfies AccountReceiver)
            : undefined;
        })
        .filter(isDefined)
        .filter(({ address }) => address !== sourceAddress),
    [allVisibleAccounts, chainKind, getSaplingAddressForAccount, isShieldedTez, sourceAddress]
  );

  const [searchValue, setSearchValue] = useState<string>('');

  const receiversList = useMemo(() => {
    const result: Array<SectionDropdownDataInterface<SendReceiver>> = [];

    const createdAccounts = myVisibleAccounts.filter(({ account }) => !isImportedAccount(account.type));
    const importedAccounts = myVisibleAccounts.filter(({ account }) => isImportedAccount(account.type));

    if (createdAccounts.length > 0) {
      result.push({ title: 'Created', data: createdAccounts });
    }

    if (importedAccounts.length > 0) {
      result.push({ title: 'Imported', data: importedAccounts });
    }

    const validContacts = contacts
      .filter(({ address }) =>
        chainKind === TempleChainKind.EVM ? isEvmAddress(address) : isValidAddress(address) || isSaplingAddress(address)
      )
      .map(toContactReceiver);

    if (validContacts.length > 0) {
      result.push({ title: 'Contacts', data: validContacts });
    }

    return result;
  }, [chainKind, contacts, myVisibleAccounts]);

  const filteredReceiversList = useMemo(() => {
    const normalizedSearchValue = searchValue.toLowerCase();

    return receiversList
      .map(section => ({
        ...section,
        data: section.data.filter(
          ({ name, address }) =>
            name.toLowerCase().includes(normalizedSearchValue) || address.toLowerCase().includes(normalizedSearchValue)
        )
      }))
      .filter(section => section.data.length > 0);
  }, [receiversList, searchValue]);

  const handleSearchValueChange = (value: string) => setSearchValue(value);

  return {
    receiversList,
    filteredReceiversList,
    handleSearchValueChange
  };
};

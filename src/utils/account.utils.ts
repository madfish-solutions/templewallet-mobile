import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { Contact } from 'src/interfaces/contact.interface';

export interface AccountForChain<C extends TempleChainKind = TempleChainKind> {
  id: string;
  chain: C;
  address: string;
  type: AccountTypeEnum;
  name: string;
}

export type AddressBookItem = Account | Contact;

export const isAccount = (item: AddressBookItem): item is Account => 'type' in item;

export const isContact = (item: AddressBookItem): item is Contact => !isAccount(item);

export const getAccountForTezos = (account: Account) => getAccountForChain(account, TempleChainKind.Tezos);

export const getAccountForEvm = (account: Account) => getAccountForChain(account, TempleChainKind.EVM);

export const getAccountAddressForTezos = (account: Account) =>
  getAccountAddressForChain(account, TempleChainKind.Tezos);

export const getAccountAddressForEvm = (account: Account) =>
  getAccountAddressForChain(account, TempleChainKind.EVM) as HexString | null;

export const getAccountAddressForChain = (account: Account, chain: TempleChainKind): string | null => {
  switch (account.type) {
    case AccountTypeEnum.HD:
    case AccountTypeEnum.IMPORTED_MULTICHAIN:
      return account[`${chain}Address`];
    case AccountTypeEnum.IMPORTED_CHAIN:
    case AccountTypeEnum.WATCH_ONLY_DEBUG:
      return account.address;
    default:
      return null;
  }
};

export const getAccountForChain = <C extends TempleChainKind>(
  account: Account,
  chain: C
): AccountForChain<C> | null => {
  const address = getAccountAddressForChain(account, chain);

  return address ? { id: account.id, chain, address, type: account.type, name: account.name } : null;
};

export const canUseAccountForChain = (account: Account, chain: TempleChainKind) =>
  getAccountAddressForChain(account, chain) !== undefined;

export const getAccountId = (account: Account) => account.id;

export const getContactAddress = (contact: Contact) => contact.address;

export const getAddressBookItemAddress = (item: AddressBookItem) =>
  isAccount(item)
    ? getAccountAddressForTezos(item) || getAccountAddressForEvm(item) || item.id
    : getContactAddress(item);

export const getAddressBookItemDisplayAddress = (item: AddressBookItem) => getAddressBookItemAddress(item) || '';

export const getAccountBaseId = (item: AddressBookItem) => (isAccount(item) ? item.id : undefined);

export const getAccountBaseDisplayAddress = getAddressBookItemDisplayAddress;

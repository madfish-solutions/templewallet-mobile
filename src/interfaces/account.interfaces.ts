import { AccountTypeEnum } from '../enums/account-type.enum';
import { TempleChainKind } from '../enums/temple-chain-kind.enum';

import { Contact, emptyContact } from './contact.interface';
import { LegacyAccountInterface } from './legacy-account.interface.ts';

export interface BaseAccount extends LegacyAccountInterface {
  id: string;
  type: AccountTypeEnum;
  name: string;
}

export interface HDAccount extends BaseAccount {
  type: AccountTypeEnum.HD_ACCOUNT;
  hdIndex: number;
  tezosAddress: string;
  evmAddress: HexString;
  walletId: string;
}

export interface ImportedAccount extends BaseAccount {
  type: AccountTypeEnum.IMPORTED_ACCOUNT;
  chain: TempleChainKind;
  address: string;
}

export interface WatchOnlyDebugAccount extends BaseAccount {
  type: AccountTypeEnum.WATCH_ONLY_DEBUG;
  chain: TempleChainKind;
  address: string;
}

export type Account = HDAccount | ImportedAccount | WatchOnlyDebugAccount;

export const isHdAccount = (account: Account): account is HDAccount => account.type === AccountTypeEnum.HD_ACCOUNT;

export const isImportedAccount = (account: Account): account is ImportedAccount =>
  account.type === AccountTypeEnum.IMPORTED_ACCOUNT;

export const isWatchOnlyDebugAccount = (account: Account): account is WatchOnlyDebugAccount =>
  account.type === AccountTypeEnum.WATCH_ONLY_DEBUG;

export type AddressBookItem = Account | Contact;
export const emptyAddressBookItem = emptyContact;

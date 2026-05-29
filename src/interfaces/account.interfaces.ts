import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import { Contact, emptyContact } from './contact.interface';

interface BaseAccount {
  id: string;
  name: string;
}

interface MultichainAccount extends BaseAccount {
  tezosAddress: string;
  tezosPublicKey: string;
  evmAddress: HexString;
  evmPublicKey: string;
}

export interface HDAccount extends MultichainAccount {
  type: AccountTypeEnum.HD;
  hdIndex: number;
}

export interface ImportedMultichainAccount extends MultichainAccount {
  type: AccountTypeEnum.IMPORTED_MULTICHAIN;
}

interface ChainAccount extends BaseAccount {
  chain: TempleChainKind;
  address: string;
  publicKey: string;
}

export interface ImportedChainAccount extends ChainAccount {
  type: AccountTypeEnum.IMPORTED_CHAIN;
}

export interface WatchOnlyDebugAccount extends ChainAccount {
  type: AccountTypeEnum.WATCH_ONLY_DEBUG;
}

export type Account = HDAccount | ImportedMultichainAccount | ImportedChainAccount | WatchOnlyDebugAccount;

/** @knipignore */
export const isHdAccount = (account: Account): account is HDAccount => account.type === AccountTypeEnum.HD;

/** @knipignore */
export const isImportedMnemonicAccount = (account: Account): account is ImportedMultichainAccount =>
  account.type === AccountTypeEnum.IMPORTED_MULTICHAIN;

/** @knipignore */
export const isImportedPrivateKeyAccount = (account: Account): account is ImportedChainAccount =>
  account.type === AccountTypeEnum.IMPORTED_CHAIN;

/** @knipignore */
export const isWatchOnlyDebugAccount = (account: Account): account is WatchOnlyDebugAccount =>
  account.type === AccountTypeEnum.WATCH_ONLY_DEBUG;

export type AddressBookItem = Account | Contact;
export const emptyAddressBookItem = emptyContact;

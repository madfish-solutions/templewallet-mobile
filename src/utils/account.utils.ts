import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';

import { isDefined } from './is-defined';
import { includesIgnoreCase } from './string.utils';

export interface AccountForChain<C extends TempleChainKind = TempleChainKind> {
  id: string;
  chain: C;
  address: string;
  publicKey: string;
  type: AccountTypeEnum;
  name: string;
}

export const getAccountForTezos = (account: Account) => getAccountForChain(account, TempleChainKind.Tezos);

/** @knipignore */
export const getAccountForEvm = (account: Account) => getAccountForChain(account, TempleChainKind.EVM);

export const getAccountAddressForTezos = (account: Account) =>
  getAccountAddressForChain(account, TempleChainKind.Tezos);

export const getAccountAddressForEvm = (account: Account) =>
  getAccountAddressForChain(account, TempleChainKind.EVM) as HexString | undefined;

export const truncateAccountAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 2)}...${address.slice(-4)}` : address;

export const accountMatchesSearch = (account: Account, searchValue: string, saplingAddress?: string | null) => {
  const tezosAddress = getAccountAddressForTezos(account);
  const evmAddress = getAccountAddressForEvm(account);

  return [account.name, tezosAddress, saplingAddress, evmAddress].some(
    value => isDefined(value) && includesIgnoreCase(value, searchValue)
  );
};

export const getAccountAddressForChain = (account: Account, chain: TempleChainKind): string | undefined => {
  switch (account.type) {
    case AccountTypeEnum.HD:
    case AccountTypeEnum.IMPORTED_MULTICHAIN:
      return account[`${chain}Address`];
    case AccountTypeEnum.IMPORTED_CHAIN:
    case AccountTypeEnum.WATCH_ONLY_DEBUG:
      return account.chain === chain ? account.address : undefined;
    default:
      return undefined;
  }
};

export const getAccountPublicKeyForTezos = (account: Account) =>
  getAccountPublicKeyForChain(account, TempleChainKind.Tezos);

const getAccountPublicKeyForChain = (account: Account, chain: TempleChainKind): string | undefined => {
  switch (account.type) {
    case AccountTypeEnum.HD:
    case AccountTypeEnum.IMPORTED_MULTICHAIN:
      return account[`${chain}PublicKey`];
    case AccountTypeEnum.IMPORTED_CHAIN:
    case AccountTypeEnum.WATCH_ONLY_DEBUG:
      return account.publicKey;
    default:
      return undefined;
  }
};

export const getAccountForChain = <C extends TempleChainKind>(
  account: Account,
  chain: C
): AccountForChain<C> | null => {
  const address = getAccountAddressForChain(account, chain);
  const publicKey = getAccountPublicKeyForChain(account, chain);

  return address && publicKey
    ? { id: account.id, chain, address, publicKey, type: account.type, name: account.name }
    : null;
};

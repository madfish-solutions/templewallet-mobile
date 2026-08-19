import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account, AccountWithEvmAddress, AccountWithTezosAddress } from 'src/interfaces/account.interfaces';

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

export function getAccountAddressForTezos(account: AccountWithTezosAddress): string;
export function getAccountAddressForTezos(account: Account): string | undefined;
export function getAccountAddressForTezos(account: Account): string | undefined {
  return getAccountAddressForChain(account, TempleChainKind.Tezos);
}

export function getAccountAddressForEvm(account: AccountWithEvmAddress): HexString;
export function getAccountAddressForEvm(account: Account): HexString | undefined;
export function getAccountAddressForEvm(account: Account): HexString | undefined {
  return getAccountAddressForChain(account, TempleChainKind.EVM) as HexString | undefined;
}

export function hasEvmAddress(account: Account): account is AccountWithEvmAddress {
  return (
    account.type === AccountTypeEnum.HD ||
    account.type === AccountTypeEnum.IMPORTED_MULTICHAIN ||
    account.chain === TempleChainKind.EVM
  );
}

export function hasTezosAddress(account: Account): account is AccountWithTezosAddress {
  return (
    account.type === AccountTypeEnum.HD ||
    account.type === AccountTypeEnum.IMPORTED_MULTICHAIN ||
    account.chain === TempleChainKind.Tezos
  );
}

export const truncateAccountAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 2)}...${address.slice(-4)}` : address;

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

export function getAccountPublicKeyForTezos(account: AccountWithTezosAddress): string;
export function getAccountPublicKeyForTezos(account: Account): string | undefined;
export function getAccountPublicKeyForTezos(account: Account): string | undefined {
  return getAccountPublicKeyForChain(account, TempleChainKind.Tezos);
}

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

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AccountBaseInterface, AccountInterface } from 'src/interfaces/account.interface';
import { WalletState } from 'src/store/wallet/wallet-state';

export interface AccountForChain<C extends TempleChainKind = TempleChainKind> {
  id: string;
  chain: C;
  address: string;
  type: AccountTypeEnum;
  name: string;
}

export const getAccountAddressForTezos = (account: AccountInterface): string | undefined =>
  account.type === AccountTypeEnum.HD_ACCOUNT
    ? account.tezosAddress ?? account.publicKeyHash
    : account.chain === undefined || account.chain === TempleChainKind.Tezos
    ? account.address ?? account.publicKeyHash
    : undefined;

export const getAccountAddressForEvm = (account: AccountInterface): string | undefined =>
  account.type === AccountTypeEnum.HD_ACCOUNT
    ? account.evmAddress
    : account.chain === TempleChainKind.EVM
    ? account.address
    : undefined;

export const getAccountAddressForChain = (account: AccountInterface, chain: TempleChainKind): string | undefined =>
  chain === TempleChainKind.Tezos ? getAccountAddressForTezos(account) : getAccountAddressForEvm(account);

export const getAccountForChain = <C extends TempleChainKind>(
  account: AccountInterface,
  chain: C
): AccountForChain<C> | null => {
  const address = getAccountAddressForChain(account, chain);

  return address ? { id: getAccountId(account), chain, address, type: account.type, name: account.name } : null;
};

export const canUseAccountForChain = (account: AccountInterface, chain: TempleChainKind) =>
  getAccountAddressForChain(account, chain) !== undefined;

export const getAccountId = (account: AccountInterface) =>
  account.id || getAccountAddressForTezos(account) || getAccountAddressForEvm(account) || account.publicKeyHash;

export const getAccountBaseId = (account: AccountBaseInterface) =>
  'id' in account && typeof account.id === 'string' ? account.id : undefined;

export const getAccountBaseAddress = (account: AccountBaseInterface) =>
  'address' in account && typeof account.address === 'string' ? account.address : undefined;

export const getAccountBaseDisplayAddress = (account: AccountBaseInterface) =>
  account.publicKeyHash || getAccountBaseAddress(account) || getAccountBaseId(account) || '';

export const findAccountByIdOrAddress = (accounts: AccountInterface[], accountIdOrAddress?: string) =>
  accountIdOrAddress
    ? accounts.find(
        account =>
          getAccountId(account) === accountIdOrAddress ||
          account.publicKeyHash === accountIdOrAddress ||
          account.tezosAddress === accountIdOrAddress ||
          account.address === accountIdOrAddress ||
          account.evmAddress === accountIdOrAddress
      )
    : undefined;

export const getSelectedAccountFromWallet = (wallet: WalletState) =>
  findAccountByIdOrAddress(wallet.accounts, wallet.selectedAccountId) ??
  wallet.accounts.find(({ type }) => type === AccountTypeEnum.HD_ACCOUNT) ??
  wallet.accounts[0];

export const getSelectedAccountIdFromWallet = (wallet: WalletState) => {
  const selectedAccount = getSelectedAccountFromWallet(wallet);

  return selectedAccount ? getAccountId(selectedAccount) : '';
};

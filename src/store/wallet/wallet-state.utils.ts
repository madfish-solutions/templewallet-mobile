import {
  initialWalletAccountState,
  WalletAccountStateInterface
} from '../../interfaces/wallet-account-state.interface';
import { AccountTokenInterface } from '../../token/interfaces/account-token.interface';
import { TokenBalanceInterface } from '../../token/interfaces/token-balance.interface';
import { emptyTokenMetadata, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { isDefined } from '../../utils/is-defined';
import { WalletState } from './wallet-state';

export const updateCurrentAccountState = (
  state: WalletState,
  updateFn: (currentAccount: WalletAccountStateInterface) => Partial<WalletAccountStateInterface>
): WalletState => updateAccountState(state, state.selectedAccountPublicKeyHash, updateFn);

export const updateAccountState = (
  state: WalletState,
  accountPublicKeyHash: string,
  updateFn: (currentAccount: WalletAccountStateInterface) => Partial<WalletAccountStateInterface>
): WalletState => ({
  ...state,
  hdAccounts: state.hdAccounts.map(account =>
    account.publicKeyHash === accountPublicKeyHash
      ? { ...account, ...updateFn({ ...initialWalletAccountState, ...account }) }
      : account
  )
});

export const tokenBalanceMetadata = ({
  token_id,
  contract,
  name,
  symbol,
  decimals,
  thumbnail_uri
}: TokenBalanceInterface): TokenMetadataInterface => ({
  ...emptyTokenMetadata,
  id: token_id,
  address: contract,
  iconUrl: thumbnail_uri,
  ...(isDefined(name) && { name }),
  ...(isDefined(symbol) && { symbol }),
  ...(isDefined(decimals) && { decimals })
});

export const pushOrUpdateTokensBalances = (
  initialTokensList: AccountTokenInterface[],
  balances: Record<string, string>
) => {
  const localBalances: Record<string, string> = { ...balances };
  const result: AccountTokenInterface[] = [];

  for (const token of initialTokensList) {
    const balance = localBalances[token.slug];
    if (isDefined(balance)) {
      result.push({ ...token, balance });

      delete localBalances[token.slug];
    } else {
      result.push(token);
    }
  }

  result.push(...Object.entries(localBalances).map(([slug, balance]) => ({ slug, balance, isVisible: true })));

  return result;
};

export const removeTokenFromTokenList = (tokensList: AccountTokenInterface[], slug: string) => {
  const result: AccountTokenInterface[] = [];

  for (const token of tokensList) {
    if (token.slug !== slug) {
      result.push(token);
    }
  }

  return result;
};

export const toggleTokenVisibility = (tokensList: AccountTokenInterface[], slug: string) => {
  const result: AccountTokenInterface[] = [];

  for (const token of tokensList) {
    if (token.slug === slug) {
      result.push({ ...token, isVisible: !token.isVisible });
    } else {
      result.push(token);
    }
  }

  return result;
};

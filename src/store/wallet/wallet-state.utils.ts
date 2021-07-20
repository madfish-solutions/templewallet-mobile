import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { AccountTokenInterface } from '../../token/interfaces/account-token.interface';
import { TokenBalanceInterface } from '../../token/interfaces/token-balance.interface';
import { emptyTokenMetadata, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { isDefined } from '../../utils/is-defined';
import { WalletState } from './wallet-state';

export const updateCurrentAccountState = (
  state: WalletState,
  updateFn: (currentAccount: WalletAccountInterface) => Partial<WalletAccountInterface>
): WalletState => ({
  ...state,
  hdAccounts: state.hdAccounts.map(account =>
    account.publicKeyHash === state.selectedAccountPublicKeyHash ? { ...account, ...updateFn(account) } : account
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

export const pushOrUpdateAccountTokensList = (
  tokensList: AccountTokenInterface[],
  slug: string,
  accountToken: AccountTokenInterface
) => {
  const result: AccountTokenInterface[] = [];
  let didUpdate = false;

  for (const token of tokensList) {
    if (token.slug === slug) {
      didUpdate = true;

      result.push(accountToken);
    } else {
      result.push(token);
    }
  }

  !didUpdate && result.push(accountToken);

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

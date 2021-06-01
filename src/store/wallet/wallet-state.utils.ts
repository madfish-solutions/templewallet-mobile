import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { AccountTokenInterface } from '../../token/interfaces/account-token.interface';
import { TokenBalanceInterface } from '../../token/interfaces/token-balance.interface';
import { emptyTokenMetadataInterface, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
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
  token_type
}: TokenBalanceInterface & { token_type: TokenTypeEnum }): TokenMetadataInterface => ({
  ...emptyTokenMetadataInterface,
  id: token_id,
  address: contract,
  type: token_type,
  ...(isDefined(name) && { name }),
  ...(isDefined(symbol) && { symbol }),
  ...(isDefined(decimals) && { decimals })
});

export const pushOrUpdateAccountTokensList = (
  tokensList: AccountTokenInterface[],
  slug: string,
  accountToken: AccountTokenInterface
) => {
  let didUpdate = false;

  const result = tokensList.map(token => {
    if (token.slug === slug) {
      didUpdate = true;

      return accountToken;
    }

    return token;
  });

  !didUpdate && result.push(accountToken);

  return result;
};

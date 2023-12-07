import { isDefined } from 'src/utils/is-defined';

import { VisibilityEnum } from '../../enums/visibility.enum';
import { AccountStateInterface, initialAccountState } from '../../interfaces/account-state.interface';
import { TokenBalanceResponse } from '../../interfaces/token-balance-response.interface';
import { AccountTokenInterface } from '../../token/interfaces/account-token.interface';

import { WalletState } from './wallet-state';

export const updateCurrentAccountState = (
  state: WalletState,
  updateFn: (currentAccountState: AccountStateInterface) => Partial<AccountStateInterface>
): WalletState => updateAccountState(state, state.selectedAccountPublicKeyHash, updateFn);

export const updateAccountState = (
  state: WalletState,
  accountPublicKeyHash: string,
  updateFn: (accountState: AccountStateInterface) => Partial<AccountStateInterface>
): WalletState => {
  const accountState = state.accountsStateRecord[accountPublicKeyHash];
  state.accountsStateRecord[accountPublicKeyHash] = {
    ...accountState,
    ...updateFn({ ...initialAccountState, ...accountState })
  };

  return state;
};

export const pushOrUpdateTokensBalances = (
  initialTokensList: AccountTokenInterface[],
  newBalances: TokenBalanceResponse[]
) => {
  const result: AccountTokenInterface[] = [];

  const newBalancesBySlugs = newBalances.reduce<Record<string, string>>((acc, { slug, balance }) => {
    acc[slug] = balance;

    return acc;
  }, {});

  for (const token of initialTokensList) {
    const balance = newBalancesBySlugs[token.slug];

    if (isDefined(balance)) {
      result.push({
        ...token,
        balance,
        visibility:
          // Note: changing visibility status on non-zero balance. Might've been a mistake
          balance !== '0' && token.visibility === VisibilityEnum.InitiallyHidden
            ? VisibilityEnum.Visible
            : token.visibility
      });

      delete newBalancesBySlugs[token.slug];
    } else {
      result.push(token);
    }
  }

  result.push(
    ...Object.entries(newBalancesBySlugs).map(([slug, balance]) => ({
      slug,
      balance,
      visibility: balance === '0' ? VisibilityEnum.InitiallyHidden : VisibilityEnum.Visible
    }))
  );

  return result;
};

export const toggleTokenVisibility = (tokensList: AccountTokenInterface[], slug: string) => {
  const result: AccountTokenInterface[] = [];

  for (const token of tokensList) {
    if (token.slug === slug) {
      result.push({
        ...token,
        visibility: token.visibility === VisibilityEnum.Visible ? VisibilityEnum.Hidden : VisibilityEnum.Visible
      });
    } else {
      result.push(token);
    }
  }

  return result;
};

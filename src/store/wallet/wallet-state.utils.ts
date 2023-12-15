import { Draft } from '@reduxjs/toolkit';

import { EMPTY_PUBLIC_KEY_HASH } from 'src/config/system';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { initialAccountState } from 'src/interfaces/account-state.interface';
import { TokenBalanceResponse } from 'src/interfaces/token-balance-response.interface';
import { AccountTokenInterface } from 'src/token/interfaces/account-token.interface';
import { isDefined } from 'src/utils/is-defined';

import { WalletState } from './wallet-state';

export const retrieveAccountState = (state: Draft<WalletState>, pkh = state.selectedAccountPublicKeyHash) => {
  if (!pkh || pkh === EMPTY_PUBLIC_KEY_HASH) {
    return null;
  }

  if (!state.accountsStateRecord[pkh]) {
    state.accountsStateRecord[pkh] = initialAccountState;
  }

  return state.accountsStateRecord[pkh];
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

import { Draft } from '@reduxjs/toolkit';

import { EMPTY_PUBLIC_KEY_HASH } from 'src/config/system';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { initialAccountState } from 'src/interfaces/account-state.interface';
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
  initialTokensList: Draft<AccountTokenInterface>[],
  newBalancesBySlugs: StringRecord
) => {
  for (const token of initialTokensList) {
    const balance = newBalancesBySlugs[token.slug];

    if (isDefined(balance)) {
      token.balance = balance;
      if (balance !== '0' && token.visibility === VisibilityEnum.InitiallyHidden) {
        // Note: changing visibility status on non-zero balance. Might've been a mistake
        token.visibility = VisibilityEnum.Visible;
      }

      delete newBalancesBySlugs[token.slug];
    }
  }

  for (const [slug, balance] of Object.entries(newBalancesBySlugs)) {
    initialTokensList.push({
      slug,
      balance,
      visibility: balance === '0' ? VisibilityEnum.InitiallyHidden : VisibilityEnum.Visible
    });
  }
};

import { createReducer } from '@reduxjs/toolkit';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { initialAccountState } from 'src/interfaces/account-state.interface';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';
import { isDcpNode } from 'src/utils/network.utils';

import { loadWhitelistAction } from '../tokens-metadata/tokens-metadata-actions';

import {
  addAccountAction,
  addTokenAction,
  loadTezosBalanceActions,
  removeTokenAction,
  setSelectedAccountIdAction,
  toggleTokenVisibilityAction,
  updateAccountAction,
  setAccountVisibility,
  loadAssetsBalancesActions,
  completeEvmAccountsMigrationAction
} from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';
import { retrieveAccountState, pushOrUpdateTokensBalances } from './wallet-state.utils';

export const walletReducers = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(addAccountAction, (state, { payload: account }) => {
    state.accounts.push(account);
    state.accountsStateRecord[account.id] = initialAccountState;
  });

  builder.addCase(updateAccountAction, (state, { payload: updatedAccount }) => {
    state.accounts = state.accounts.map(item => (item.id === updatedAccount.id ? updatedAccount : item));
  });

  builder.addCase(completeEvmAccountsMigrationAction, (state, { payload: migratedAccounts }) => {
    state.accounts = migratedAccounts;
  });

  builder.addCase(setAccountVisibility, (state, { payload: { accountId, isVisible } }) => {
    const accountState = retrieveAccountState(state, accountId);

    if (accountState) {
      accountState.isVisible = isVisible;
    }
  });

  builder.addCase(loadWhitelistAction.success, (state, { payload }) => {
    for (const accountState of Object.values(state.accountsStateRecord)) {
      if (!accountState.tokensList) {
        // `tokensList` appeared to be undefined once
        console.warn('Tokens list absent for some account state');
        accountState.tokensList = [];
      }
      const currentSlugs = new Set(accountState.tokensList.map(({ slug }) => slug));

      for (const token of payload) {
        const slug = toTokenSlug(token.contractAddress, token.fa2TokenId);
        if (!currentSlugs.has(slug)) {
          accountState.tokensList.push({
            slug,
            balance: '0',
            visibility: VisibilityEnum.InitiallyHidden
          });
        }
      }
    }
  });

  builder.addCase(setSelectedAccountIdAction, (state, { payload: accountId }) => {
    if (!accountId) return;

    state.selectedAccountId = accountId;
  });

  builder.addCase(loadTezosBalanceActions.success, (state, { payload }) => {
    for (const accountId in payload) {
      const newBalance = payload[accountId];

      if (!newBalance) {
        continue;
      }

      const accountState = retrieveAccountState(state, accountId);
      if (accountState) {
        accountState.tezosBalance = newBalance;
      }
    }
  });

  builder.addCase(loadAssetsBalancesActions.success, (state, { payload: { accountId, balances, selectedRpcUrl } }) => {
    const accountState = retrieveAccountState(state, accountId);
    if (!accountState) {
      return;
    }

    pushOrUpdateTokensBalances(
      isDcpNode(selectedRpcUrl) ? accountState.dcpTokensList : accountState.tokensList,
      balances
    );
  });

  builder.addCase(addTokenAction, (state, { payload: tokenMetadata }) => {
    const accountState = retrieveAccountState(state);
    if (!accountState) {
      return;
    }

    const slug = getTokenSlug(tokenMetadata);

    const removedI = accountState.removedTokensList.findIndex(s => s === slug);
    if (removedI > -1) {
      accountState.removedTokensList.splice(removedI, 1);
    }

    if (!accountState.tokensList.some(t => t.slug === slug)) {
      accountState.tokensList.push({
        slug,
        balance: '0',
        visibility: VisibilityEnum.InitiallyHidden
      });
    }
  });

  builder.addCase(removeTokenAction, (state, { payload: slug }) => {
    const accountState = retrieveAccountState(state);

    if (accountState && !accountState.removedTokensList.includes(slug)) {
      accountState.removedTokensList.push(slug);
    }
  });

  builder.addCase(toggleTokenVisibilityAction, (state, { payload: { slug, selectedRpcUrl } }) => {
    const accountState = retrieveAccountState(state);

    const token = accountState?.[isDcpNode(selectedRpcUrl) ? 'dcpTokensList' : 'tokensList']?.find(
      t => t.slug === slug
    );

    if (token) {
      token.visibility = token.visibility === VisibilityEnum.Visible ? VisibilityEnum.Hidden : VisibilityEnum.Visible;
    }
  });
});

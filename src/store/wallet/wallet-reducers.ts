import { createReducer } from '@reduxjs/toolkit';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { initialAccountState } from 'src/interfaces/account-state.interface';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';
import { isDcpNode } from 'src/utils/network.utils';

import { loadWhitelistAction } from '../tokens-metadata/tokens-metadata-actions';

import {
  addHdAccountAction,
  addTokenAction,
  loadTezosBalanceActions,
  loadTokensActions,
  removeTokenAction,
  setSelectedAccountAction,
  toggleTokenVisibilityAction,
  updateAccountAction,
  setAccountVisibility,
  loadTokensBalancesArrayActions
} from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';
import { retrieveAccountState, pushOrUpdateTokensBalances } from './wallet-state.utils';

export const walletReducers = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(addHdAccountAction, (state, { payload: account }) => ({
    ...state,
    accounts: [...state.accounts, account],
    accountsStateRecord: { ...state.accountsStateRecord, [account.publicKeyHash]: initialAccountState }
  }));

  builder.addCase(updateAccountAction, (state, { payload: updatedAccount }) => ({
    ...state,
    accounts: state.accounts.map(item =>
      item.publicKeyHash === updatedAccount.publicKeyHash ? { ...item, ...updatedAccount } : item
    )
  }));

  builder.addCase(setAccountVisibility, (state, { payload: { publicKeyHash, isVisible } }) => {
    const accountState = retrieveAccountState(state, publicKeyHash);

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

  builder.addCase(setSelectedAccountAction, (state, { payload: selectedAccountPublicKeyHash }) => ({
    ...state,
    selectedAccountPublicKeyHash: selectedAccountPublicKeyHash ?? ''
  }));

  builder.addCase(loadTezosBalanceActions.success, (state, { payload }) => {
    const accountState = retrieveAccountState(state);
    if (accountState) {
      accountState.tezosBalance = payload;
    }
  });

  builder.addCase(loadTokensActions.success, (state, { payload: { slugs, ofDcpNetwork } }) => {
    const accountState = retrieveAccountState(state);
    if (!accountState) {
      return;
    }

    const tokens = accountState[ofDcpNetwork ? 'dcpTokensList' : 'tokensList'];
    const currentSlugs = new Set(tokens.map(({ slug }) => slug));

    for (const slug of slugs) {
      if (!currentSlugs.has(slug)) {
        tokens.push({ slug, balance: '0', visibility: VisibilityEnum.InitiallyHidden });
      }
    }
  });

  builder.addCase(
    loadTokensBalancesArrayActions.success,
    (state, { payload: { publicKeyHash, data, selectedRpcUrl } }) => {
      const accountState = retrieveAccountState(state, publicKeyHash);
      if (!accountState) {
        return;
      }

      if (isDcpNode(selectedRpcUrl)) {
        accountState.dcpTokensList = pushOrUpdateTokensBalances(accountState.dcpTokensList, data);
      } else {
        accountState.tokensList = pushOrUpdateTokensBalances(accountState.tokensList, data);
      }
    }
  );

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

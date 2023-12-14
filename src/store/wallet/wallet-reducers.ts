import { createReducer } from '@reduxjs/toolkit';
import { uniqBy } from 'lodash-es';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { initialAccountState } from 'src/interfaces/account-state.interface';
import type { AccountTokenInterface } from 'src/token/interfaces/account-token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
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
import {
  pushOrUpdateTokensBalances,
  toggleTokenVisibility,
  updateAccountState,
  updateCurrentAccountState
} from './wallet-state.utils';

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
  builder.addCase(setAccountVisibility, (state, { payload: { publicKeyHash, isVisible } }) =>
    updateAccountState(state, publicKeyHash, account => ({
      ...account,
      isVisible
    }))
  );
  builder.addCase(loadWhitelistAction.success, (state, { payload: tokensMetadata }) => ({
    ...state,
    accountsStateRecord: Object.keys(state.accountsStateRecord).reduce((accountsState, publicHash) => {
      return {
        ...accountsState,
        [publicHash]: {
          ...accountsState[publicHash],
          tokensList: uniqBy(
            [
              // `tokensList` appeared to be undefined once
              ...(accountsState[publicHash].tokensList ?? []),
              ...tokensMetadata.map(token => ({
                ...token,
                slug: getTokenSlug(token),
                balance: '0',
                visibility: VisibilityEnum.InitiallyHidden
              }))
            ],
            'slug'
          )
        }
      };
    }, state.accountsStateRecord)
  }));
  builder.addCase(setSelectedAccountAction, (state, { payload: selectedAccountPublicKeyHash }) => ({
    ...state,
    selectedAccountPublicKeyHash: selectedAccountPublicKeyHash ?? ''
  }));

  builder.addCase(loadTezosBalanceActions.success, (state, { payload: tezosBalance }) =>
    updateCurrentAccountState(state, () => ({ tezosBalance }))
  );

  builder.addCase(loadTokensActions.success, (state, { payload: { slugs, ofDcpNetwork } }) =>
    updateCurrentAccountState(state, currentAccount => {
      const sourceName = ofDcpNetwork ? 'dcpTokensList' : 'tokensList';
      const currentSlugs = currentAccount[sourceName].map(({ slug }) => slug);

      const newTokens = slugs.reduce<AccountTokenInterface[]>(
        (acc, slug) =>
          currentSlugs.includes(slug)
            ? acc
            : acc.concat({ slug, balance: '0', visibility: VisibilityEnum.InitiallyHidden }),
        []
      );

      return {
        [sourceName]: [...currentAccount[sourceName], ...newTokens]
      };
    })
  );

  builder.addCase(
    loadTokensBalancesArrayActions.success,
    (state, { payload: { publicKeyHash, data, selectedRpcUrl } }) => {
      const isTezosNode = !isDcpNode(selectedRpcUrl);

      return updateAccountState(state, publicKeyHash, account =>
        isTezosNode
          ? {
              tokensList: pushOrUpdateTokensBalances(account.tokensList, data)
            }
          : {
              dcpTokensList: pushOrUpdateTokensBalances(account.dcpTokensList, data)
            }
      );
    }
  );

  builder.addCase(addTokenAction, (state, { payload: tokenMetadata }) => {
    const slug = getTokenSlug(tokenMetadata);

    return updateCurrentAccountState(state, currentAccount => ({
      tokensList: pushOrUpdateTokensBalances(currentAccount.tokensList, [{ slug, balance: '0' }]),
      removedTokensList: currentAccount.removedTokensList.filter(removedTokenSlug => removedTokenSlug !== slug)
    }));
  });
  builder.addCase(removeTokenAction, (state, { payload: slug }) =>
    updateCurrentAccountState(state, currentAccount => ({
      removedTokensList: [...currentAccount.removedTokensList, slug]
    }))
  );

  builder.addCase(toggleTokenVisibilityAction, (state, { payload: { slug, selectedRpcUrl } }) => {
    const isTezosNode = !isDcpNode(selectedRpcUrl);

    return updateCurrentAccountState(state, currentAccount =>
      isTezosNode
        ? {
            tokensList: toggleTokenVisibility(currentAccount.tokensList, slug)
          }
        : {
            dcpTokensList: toggleTokenVisibility(currentAccount.dcpTokensList, slug)
          }
    );
  });
});

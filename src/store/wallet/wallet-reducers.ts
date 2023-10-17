import { createReducer } from '@reduxjs/toolkit';
import { uniqBy } from 'lodash-es';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { AccountStateInterface, initialAccountState } from 'src/interfaces/account-state.interface';
import { AccountInterface } from 'src/interfaces/account.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { isDcpNode } from 'src/utils/network.utils';

import {
  deleteOldIsShownDomainName,
  deleteOldQuipuApy,
  deleteOldTokensMetadata,
  deleteOldTokenSuggestion,
  migrateAccountsState
} from '../migration/migration-actions';
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

  builder.addCase(loadTokensActions.success, (state, { payload: tokensWithBalancesSlugs }) =>
    updateCurrentAccountState(state, currentAccount => {
      const newTokensSlugs = tokensWithBalancesSlugs.filter(
        newTokenSlug => currentAccount.tokensList.findIndex(existingToken => existingToken.slug === newTokenSlug) === -1
      );

      return {
        tokensList: [
          ...currentAccount.tokensList,
          ...newTokensSlugs.map(slug => ({ slug, balance: '0', visibility: VisibilityEnum.InitiallyHidden }))
        ]
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

  // MIGRATIONS
  builder.addCase(deleteOldTokensMetadata, state => ({
    ...state,
    tokensMetadata: undefined
  }));
  builder.addCase(deleteOldTokenSuggestion, state => ({
    ...state,
    addTokenSuggestion: undefined
  }));
  builder.addCase(deleteOldIsShownDomainName, state => ({
    ...state,
    isShownDomainName: undefined
  }));
  builder.addCase(deleteOldQuipuApy, state => ({
    ...state,
    quipuApy: undefined
  }));
  builder.addCase(migrateAccountsState, state => {
    if (state.accounts[0]?.isVisible === undefined) {
      return state;
    } else {
      const accounts: AccountInterface[] = [];
      const accountsStateRecord: Record<string, AccountStateInterface> = {};

      for (const account of state.accounts) {
        accountsStateRecord[account.publicKeyHash] = {
          isVisible: account.isVisible ?? initialAccountState.isVisible,
          tezosBalance: account.tezosBalance ?? initialAccountState.tezosBalance,
          tokensList:
            account.tokensList?.map(token =>
              isDefined(token.isVisible)
                ? {
                    ...token,
                    visibility: token.isVisible ? VisibilityEnum.Visible : VisibilityEnum.InitiallyHidden,
                    isVisible: undefined
                  }
                : token
            ) ?? initialAccountState.tokensList,
          dcpTokensList: initialAccountState.dcpTokensList,
          removedTokensList: account.removedTokensList ?? initialAccountState.removedTokensList
        };

        accounts.push({
          ...account,
          isVisible: undefined,
          tezosBalance: undefined,
          tokensList: undefined,
          removedTokensList: undefined,
          activityGroups: undefined,
          pendingActivities: undefined
        });
      }

      return {
        ...state,
        accounts,
        accountsStateRecord
      };
    }
  });
});

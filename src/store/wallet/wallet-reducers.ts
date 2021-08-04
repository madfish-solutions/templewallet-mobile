import { createReducer } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';

import { initialAccountState } from '../../interfaces/account-state.interface';
import { AccountTokenInterface } from '../../token/interfaces/account-token.interface';
import { emptyTokenMetadata } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { mutezToTz } from '../../utils/tezos.util';
import { createEntity } from '../create-entity';
import {
  addHdAccountAction,
  addPendingOperation,
  addTokenMetadataAction,
  loadActivityGroupsActions,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  loadTokenMetadataActions,
  loadTokenSuggestionActions,
  removeTokenAction,
  setSelectedAccountAction,
  toggleTokenVisibilityAction
} from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';
import {
  pushOrUpdateAccountTokensList,
  removeTokenFromTokenList,
  toggleTokenVisibility,
  tokenBalanceMetadata,
  updateCurrentAccountState,
  updateAccountState
} from './wallet-state.utils';

export const walletReducers = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(addHdAccountAction, (state, { payload: account }) => ({
    ...state,
    hdAccounts: [...state.hdAccounts, { ...account, ...initialAccountState }]
  }));
  builder.addCase(setSelectedAccountAction, (state, { payload: selectedAccountPublicKeyHash }) => ({
    ...state,
    selectedAccountPublicKeyHash: selectedAccountPublicKeyHash ?? ''
  }));

  builder.addCase(loadTezosBalanceActions.submit, state =>
    updateCurrentAccountState(state, currentAccount => ({
      tezosBalance: createEntity(currentAccount.tezosBalance.data, true)
    }))
  );
  builder.addCase(loadTezosBalanceActions.success, (state, { payload: balance }) =>
    updateCurrentAccountState(state, () => ({ tezosBalance: createEntity(balance, false) }))
  );
  builder.addCase(loadTezosBalanceActions.fail, (state, { payload: error }) =>
    updateCurrentAccountState(state, account => ({
      tezosBalance: createEntity(account.tezosBalance.data, false, error)
    }))
  );

  builder.addCase(loadTokenBalancesActions.success, (state, { payload: tokenBalancesList }) =>
    tokenBalancesList.reduce((prevState, tokenBalance) => {
      const tokenMetadata = tokenBalanceMetadata(tokenBalance);
      const slug = getTokenSlug(tokenMetadata);

      const newState: WalletState = {
        ...prevState,
        tokensMetadata: {
          ...prevState.tokensMetadata,
          [slug]: {
            ...prevState.tokensMetadata[slug],
            ...tokenMetadata
          }
        }
      };

      const accountToken: AccountTokenInterface = {
        slug,
        balance: mutezToTz(new BigNumber(tokenBalance.balance), tokenMetadata.decimals).toString(),
        isVisible: true
      };

      return updateCurrentAccountState(newState, currentAccount => ({
        tokensList: pushOrUpdateAccountTokensList(currentAccount.tokensList, slug, accountToken)
      }));
    }, state)
  );

  builder.addCase(loadTokenSuggestionActions.submit, state => ({
    ...state,
    addTokenSuggestion: createEntity(emptyTokenMetadata, true)
  }));
  builder.addCase(loadTokenSuggestionActions.success, (state, { payload: tokenMetadata }) => ({
    ...state,
    addTokenSuggestion: createEntity(tokenMetadata, false)
  }));
  builder.addCase(loadTokenSuggestionActions.fail, (state, { payload: error }) => ({
    ...state,
    addTokenSuggestion: createEntity(emptyTokenMetadata, false, error)
  }));

  builder.addCase(loadTokenMetadataActions.success, (state, { payload: tokenMetadata }) => ({
    ...state,
    tokensMetadata: {
      ...state.tokensMetadata,
      [getTokenSlug(tokenMetadata)]: tokenMetadata
    }
  }));

  builder.addCase(addTokenMetadataAction, (state, { payload: tokenMetadata }) => {
    const slug = getTokenSlug(tokenMetadata);

    return {
      ...updateCurrentAccountState(state, currentAccount => ({
        tokensList: pushOrUpdateAccountTokensList(currentAccount.tokensList, slug, {
          slug,
          balance: '0',
          isVisible: true
        })
      })),
      tokensMetadata: {
        ...state.tokensMetadata,
        [slug]: tokenMetadata
      }
    };
  });
  builder.addCase(removeTokenAction, (state, { payload: slug }) =>
    updateCurrentAccountState(state, currentAccount => ({
      tokensList: removeTokenFromTokenList(currentAccount.tokensList, slug)
    }))
  );
  builder.addCase(toggleTokenVisibilityAction, (state, { payload: slug }) =>
    updateCurrentAccountState(state, currentAccount => ({
      tokensList: toggleTokenVisibility(currentAccount.tokensList, slug)
    }))
  );

  builder.addCase(addPendingOperation, (state, { payload }) =>
    updateAccountState(state, payload[0].source.address, account => ({
      ...account,
      pendingActivities: [payload, ...account.pendingActivities]
    }))
  );

  builder.addCase(loadActivityGroupsActions.submit, state =>
    updateCurrentAccountState(state, account => ({
      ...account,
      activityGroups: createEntity(account.activityGroups.data, true)
    }))
  );
  builder.addCase(loadActivityGroupsActions.success, (state, { payload: activityGroups }) =>
    updateCurrentAccountState(state, account => ({
      ...account,
      activityGroups: createEntity(activityGroups),
      pendingActivities: account.pendingActivities.filter(
        pendingActivityGroup =>
          !activityGroups.some(
            completedActivityGroup => completedActivityGroup[0].hash === pendingActivityGroup[0].hash
          )
      )
    }))
  );
  builder.addCase(loadActivityGroupsActions.fail, (state, { payload: error }) =>
    updateCurrentAccountState(state, account => ({
      ...account,
      activityGroups: createEntity(account.activityGroups.data, false, error)
    }))
  );
});

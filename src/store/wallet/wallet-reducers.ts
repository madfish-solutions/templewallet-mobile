import { createReducer } from '@reduxjs/toolkit';

import { initialAccountState } from '../../interfaces/account-state.interface';
import { emptyTokenMetadata } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { createEntity } from '../create-entity';
import {
  addHdAccountAction,
  addPendingOperation,
  addTokenMetadataAction,
  approveInternalOperationRequestActions,
  loadActivityGroupsActions,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  loadTokenMetadataActions,
  loadTokenSuggestionActions,
  removeTokenAction,
  setSelectedAccountAction,
  toggleTokenVisibilityAction,
  updateWalletAccountAction
} from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';
import {
  pushOrUpdateTokensBalances,
  removeTokenFromTokenList,
  toggleTokenVisibility,
  updateAccountState,
  updateCurrentAccountState
} from './wallet-state.utils';

export const walletReducers = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(addHdAccountAction, (state, { payload: account }) => ({
    ...state,
    accounts: [...state.accounts, { ...account, ...initialAccountState }]
  }));
  builder.addCase(updateWalletAccountAction, (state, { payload: updatedAccount }) => ({
    ...state,
    accounts: state.accounts.map(item =>
      item.publicKeyHash === updatedAccount.publicKeyHash ? { ...item, ...updatedAccount } : item
    )
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

  builder.addCase(loadTokenBalancesActions.success, (state, { payload: { balancesRecord, metadataList } }) => {
    const tokensMetadata = metadataList.reduce((prevState, tokenMetadata) => {
      const slug = getTokenSlug(tokenMetadata);

      return {
        ...prevState,
        [slug]: {
          ...prevState[slug],
          ...tokenMetadata
        }
      };
    }, state.tokensMetadata);

    return updateCurrentAccountState({ ...state, tokensMetadata }, currentAccount => ({
      tokensList: pushOrUpdateTokensBalances(currentAccount.tokensList, balancesRecord)
    }));
  });

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
        tokensList: pushOrUpdateTokensBalances(currentAccount.tokensList, { [slug]: '0' })
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

  builder.addCase(approveInternalOperationRequestActions.success, (state, { payload }) => {
    return {
      ...state,
      isInternalOperationApproved: payload
    };
  });
});

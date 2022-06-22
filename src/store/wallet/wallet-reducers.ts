import { createReducer } from '@reduxjs/toolkit';

import { initialAccountState } from '../../interfaces/account-state.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import {
  addHdAccountAction,
  addPendingOperation,
  addTokenAction,
  loadActivityGroupsActions,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  removeTokenAction,
  setSelectedAccountAction,
  toggleTokenVisibilityAction,
  updateAccountAction,
  setAccountVisibility
} from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';
import {
  isPendingOperationOutdated,
  pushOrUpdateTokensBalances,
  toggleTokenVisibility,
  updateAccountState,
  updateCurrentAccountState
} from './wallet-state.utils';

export const walletReducers = createReducer<WalletState>(walletInitialState, builder => {
  // TODO: write whole migration
  // builder.addCase(migrateAssetsVisibility, state => ({
  //   ...state,
  //   accounts: state.accounts.map(account => ({
  //     ...account,
  //     tokensList: account.tokensList.map(asset => {
  //       if (isDefined(asset.isVisible)) {
  //         const assetCopy = {
  //           ...asset,
  //           visibility: asset.isVisible ? VisibilityEnum.Visible : VisibilityEnum.InitiallyHidden
  //         };
  //         delete assetCopy.isVisible;
  //
  //         return assetCopy;
  //       }
  //
  //       return asset;
  //     })
  //   }))
  // }));
  builder.addCase(addHdAccountAction, (state, { payload: account }) => ({
    ...state,
    accounts: [...state.accounts, { ...account, ...initialAccountState }]
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
  builder.addCase(setSelectedAccountAction, (state, { payload: selectedAccountPublicKeyHash }) => ({
    ...state,
    selectedAccountPublicKeyHash: selectedAccountPublicKeyHash ?? ''
  }));

  builder.addCase(loadTezosBalanceActions.success, (state, { payload: tezosBalance }) =>
    updateCurrentAccountState(state, () => ({ tezosBalance }))
  );

  builder.addCase(loadTokenBalancesActions.success, (state, { payload: balancesRecord }) =>
    updateCurrentAccountState(state, currentAccount => ({
      tokensList: pushOrUpdateTokensBalances(currentAccount.tokensList, balancesRecord)
    }))
  );

  builder.addCase(addTokenAction, (state, { payload: tokenMetadata }) => {
    const slug = getTokenSlug(tokenMetadata);

    return updateCurrentAccountState(state, currentAccount => ({
      tokensList: pushOrUpdateTokensBalances(currentAccount.tokensList, { [slug]: '0' }),
      removedTokensList: currentAccount.removedTokensList.filter(removedTokenSlug => removedTokenSlug !== slug)
    }));
  });
  builder.addCase(removeTokenAction, (state, { payload: slug }) =>
    updateCurrentAccountState(state, currentAccount => ({
      removedTokensList: [...currentAccount.removedTokensList, slug]
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

  builder.addCase(loadActivityGroupsActions.success, (state, { payload: activityGroups }) =>
    updateCurrentAccountState(state, account => ({
      ...account,
      activityGroups,
      pendingActivities: account.pendingActivities.filter(
        pendingActivityGroup =>
          !activityGroups.some(
            completedActivityGroup => completedActivityGroup[0].hash === pendingActivityGroup[0].hash
          ) && !isPendingOperationOutdated(pendingActivityGroup[0].timestamp)
      )
    }))
  );
});

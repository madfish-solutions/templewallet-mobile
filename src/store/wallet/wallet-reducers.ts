import { createReducer } from '@reduxjs/toolkit';

import { initialAccountState } from '../../interfaces/account-state.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import {
  addHdAccountAction,
  addTokenAction,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  removeTokenAction,
  setSelectedAccountAction,
  toggleTokenVisibilityAction,
  updateAccountAction,
  setAccountVisibility,
  loadRenderTokenBalanceActions
} from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';
import {
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

  builder.addCase(loadRenderTokenBalanceActions.success, (state, { payload: { slug, balance } }) => {
    return updateCurrentAccountState(state, currentAccount => ({
      tokensList: pushOrUpdateTokensBalances(currentAccount.tokensList, { [slug]: balance })
    }));
  });

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
});

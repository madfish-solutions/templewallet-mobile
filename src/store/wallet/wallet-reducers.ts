import { createReducer } from '@reduxjs/toolkit';

import { VisibilityEnum } from '../../enums/visibility.enum';
import { AccountStateInterface, initialAccountState } from '../../interfaces/account-state.interface';
import { AccountInterface } from '../../interfaces/account.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
import {
  deleteOldIsShownDomainName,
  deleteOldQuipuApy,
  deleteOldTokensMetadata,
  deleteOldTokenSuggestion,
  migrateAccountsState
} from '../migration/migration-actions';
import {
  addHdAccountAction,
  addTokenAction,
  loadTezosBalanceActions,
  loadTokensWithBalancesActions,
  removeTokenAction,
  setSelectedAccountAction,
  toggleTokenVisibilityAction,
  updateAccountAction,
  setAccountVisibility,
  loadTokenBalanceActions
} from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';
import {
  pushNewTokenBalances,
  pushOrUpdateTokensBalances,
  toggleTokenVisibility,
  updateAccountState,
  updateCurrentAccountState
} from './wallet-state.utils';

export const walletReducers = createReducer<WalletState>(walletInitialState, builder => {
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

  builder.addCase(loadTokensWithBalancesActions.success, (state, { payload: balancesRecord }) =>
    updateCurrentAccountState(state, currentAccount => ({
      tokensList: pushNewTokenBalances(currentAccount.tokensList, balancesRecord)
    }))
  );

  builder.addCase(loadTokenBalanceActions.success, (state, { payload: { slug, balance } }) => {
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

  // MIGRATIONS
  builder.addCase(deleteOldTokensMetadata, state => {
    const stateCopy = { ...state };
    delete stateCopy.tokensMetadata;

    return stateCopy;
  });
  builder.addCase(deleteOldTokenSuggestion, state => {
    const stateCopy = { ...state };
    delete stateCopy.addTokenSuggestion;

    return stateCopy;
  });
  builder.addCase(deleteOldIsShownDomainName, state => {
    const stateCopy = { ...state };
    delete stateCopy.isShownDomainName;

    return stateCopy;
  });
  builder.addCase(deleteOldQuipuApy, state => {
    const stateCopy = { ...state };
    delete stateCopy.quipuApy;

    return stateCopy;
  });
  builder.addCase(migrateAccountsState, state => {
    if ('isVisible' in state.accounts[0]) {
      const accounts: AccountInterface[] = [];
      const accountsStateRecord: Record<string, AccountStateInterface> = {};

      for (const account of state.accounts) {
        accountsStateRecord[account.publicKeyHash] = {
          isVisible: account.isVisible ?? initialAccountState.isVisible,
          tezosBalance: account.tezosBalance ?? initialAccountState.tezosBalance,
          tokensList:
            account.tokensList?.map(asset => {
              if (isDefined(asset.isVisible)) {
                const assetCopy = {
                  ...asset,
                  visibility: asset.isVisible ? VisibilityEnum.Visible : VisibilityEnum.InitiallyHidden
                };
                delete assetCopy.isVisible;

                return assetCopy;
              }

              return asset;
            }) ?? initialAccountState.tokensList,
          removedTokensList: account.removedTokensList ?? initialAccountState.removedTokensList
        };

        const accountCopy = { ...account };
        delete accountCopy.isVisible;
        delete accountCopy.tezosBalance;
        delete accountCopy.tokensList;
        delete accountCopy.removedTokensList;
        delete accountCopy.activityGroups;
        delete accountCopy.pendingActivities;

        accounts.push(accountCopy);
      }

      return {
        ...state,
        accounts,
        accountsStateRecord
      };
    } else {
      return state;
    }
  });
});

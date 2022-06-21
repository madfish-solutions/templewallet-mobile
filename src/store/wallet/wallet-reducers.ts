import { createReducer } from '@reduxjs/toolkit';

import { VisibilityEnum } from '../../enums/visibility.enum';
import { initialAccountState } from '../../interfaces/account-state.interface';
import { emptyTokenMetadata } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
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
  migrateAssetsVisibility,
  removeTokenAction,
  setSelectedAccountAction,
  toggleTokenVisibilityAction,
  updateWalletAccountAction
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
  builder.addCase(migrateAssetsVisibility, state => ({
    ...state,
    accounts: state.accounts.map(account => ({
      ...account,
      tokensList: account.tokensList.map(asset => {
        if (isDefined(asset.isVisible)) {
          const assetCopy = {
            ...asset,
            visibility: asset.isVisible ? VisibilityEnum.Visible : VisibilityEnum.InitiallyHidden
          };
          delete assetCopy.isVisible;

          return assetCopy;
        }

        return asset;
      })
    }))
  }));
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

  builder.addCase(loadTezosBalanceActions.success, (state, { payload: tezosBalance }) =>
    updateCurrentAccountState(state, () => ({ tezosBalance }))
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
        tokensList: pushOrUpdateTokensBalances(currentAccount.tokensList, { [slug]: '0' }),
        removedTokensList: currentAccount.removedTokensList.filter(removedTokenSlug => removedTokenSlug !== slug)
      })),
      tokensMetadata: {
        ...state.tokensMetadata,
        [slug]: tokenMetadata
      }
    };
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
          ) && !isPendingOperationOutdated(pendingActivityGroup[0].timestamp)
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

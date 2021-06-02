import { createReducer } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';

import { initialAccountSettings } from '../../interfaces/account-settings.interface';
import { AccountTokenInterface } from '../../token/interfaces/account-token.interface';
import { emptyTokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { tokenMetadataSlug } from '../../token/utils/token.utils';
import { mutezToTz } from '../../utils/tezos.util';
import { createEntity } from '../create-entity';
import {
  addHdAccountAction,
  addTokenMetadataAction,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  loadTokenMetadataActions,
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
  updateCurrentAccountState
} from './wallet-state.utils';

export const walletReducers = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(addHdAccountAction, (state, { payload: account }) => ({
    ...state,
    hdAccounts: [...state.hdAccounts, { ...account, ...initialAccountSettings }]
  }));
  builder.addCase(setSelectedAccountAction, (state, { payload: selectedAccountPublicKeyHash }) => ({
    ...state,
    selectedAccountPublicKeyHash: selectedAccountPublicKeyHash ?? ''
  }));

  builder.addCase(loadTezosBalanceActions.submit, state =>
    updateCurrentAccountState(state, () => ({ tezosBalance: createEntity('0', true) }))
  );
  builder.addCase(loadTezosBalanceActions.success, (state, { payload: balance }) =>
    updateCurrentAccountState(state, () => ({ tezosBalance: createEntity(balance, false) }))
  );
  builder.addCase(loadTezosBalanceActions.fail, (state, { payload: error }) =>
    updateCurrentAccountState(state, () => ({ tezosBalance: createEntity('0', false, error) }))
  );

  builder.addCase(loadTokenBalancesActions.success, (state, { payload: tokenBalancesList }) =>
    tokenBalancesList.reduce((prevState, tokenBalance) => {
      const tokenMetadata = tokenBalanceMetadata(tokenBalance);
      const slug = tokenMetadataSlug(tokenMetadata);

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

  builder.addCase(loadTokenMetadataActions.submit, state => ({
    ...state,
    addTokenSuggestion: createEntity(emptyTokenMetadataInterface, true)
  }));
  builder.addCase(loadTokenMetadataActions.success, (state, { payload: tokenMetadata }) => ({
    ...state,
    addTokenSuggestion: createEntity(tokenMetadata, false)
  }));
  builder.addCase(loadTokenMetadataActions.fail, (state, { payload: error }) => ({
    ...state,
    addTokenSuggestion: createEntity(emptyTokenMetadataInterface, false, error)
  }));

  builder.addCase(addTokenMetadataAction, (state, { payload: tokenMetadata }) => {
    const slug = tokenMetadataSlug(tokenMetadata);

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
});

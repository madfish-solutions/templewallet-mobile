import { createReducer } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';

import { initialAccountSettings } from '../../interfaces/account-settings.interface';
import { AccountTokenInterface } from '../../token/interfaces/account-token.interface';
import { tokenMetadataSlug } from '../../token/utils/token.utils';
import { mutezToTz } from '../../utils/tezos.util';
import { createEntity } from '../create-entity';
import {
  addHdAccountAction,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  setSelectedAccountAction
} from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';
import { pushOrUpdateAccountTokensList, tokenBalanceMetadata, updateCurrentAccountState } from './wallet-state.utils';

export const walletsReducer = createReducer<WalletState>(walletInitialState, builder => {
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
        isShown: true
      };

      return updateCurrentAccountState(newState, currentAccount => ({
        tokensList: pushOrUpdateAccountTokensList(currentAccount.tokensList, slug, accountToken)
      }));
    }, state)
  );
});

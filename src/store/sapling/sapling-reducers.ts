import { createReducer } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';

import {
  cancelSaplingPreparationAction,
  clearPreparedOpParamsAction,
  clearSaplingCredentialsAction,
  loadSaplingCredentialsActions,
  loadSaplingTransactionHistoryActions,
  loadShieldedBalanceActions,
  prepareSaplingTransactionActions,
  setHasSeenAnnouncementAction
} from './sapling-actions';
import { SaplingState, saplingInitialState, initialSaplingAccountState } from './sapling-state';

export const saplingReducers = createReducer<SaplingState>(saplingInitialState, builder => {
  builder.addCase(loadSaplingCredentialsActions.success, (state, { payload }) => {
    const { publicKeyHash, saplingAddress, viewingKey } = payload;
    state.accountsRecord[publicKeyHash] = {
      ...(state.accountsRecord[publicKeyHash] ?? initialSaplingAccountState),
      saplingAddress,
      viewingKey,
      isCredentialsLoaded: true
    };
  });

  builder.addCase(loadSaplingCredentialsActions.fail, (_state, { payload: _error }) => {
    // Credentials failed to load - the state remains unchanged
  });

  builder.addCase(loadShieldedBalanceActions.submit, (state, _action) => {
    for (const pkh of Object.keys(state.accountsRecord)) {
      if (state.accountsRecord[pkh].isCredentialsLoaded) {
        state.accountsRecord[pkh].isBalanceLoading = true;
      }
    }
  });

  builder.addCase(loadShieldedBalanceActions.success, (state, { payload }) => {
    const { publicKeyHash, balance } = payload;
    state.accountsRecord[publicKeyHash].shieldedBalance = balance;
    state.accountsRecord[publicKeyHash].isBalanceLoading = false;
  });

  builder.addCase(loadShieldedBalanceActions.fail, (state, { payload: _error }) => {
    for (const pkh of Object.keys(state.accountsRecord)) {
      state.accountsRecord[pkh].isBalanceLoading = false;
    }
  });

  builder.addCase(setHasSeenAnnouncementAction, state => {
    state.hasSeenAnnouncement = true;
  });

  builder.addCase(prepareSaplingTransactionActions.submit, state => {
    state.isPreparing = true;
    state.preparedOpParams = null;
  });

  builder.addCase(prepareSaplingTransactionActions.success, (state, { payload }) => {
    state.isPreparing = false;
    // @ts-expect-error: Immer's Draft<ParamsWithKind[]> exceeds TS type depth limit
    state.preparedOpParams = payload;
  });

  builder.addCase(prepareSaplingTransactionActions.fail, state => {
    state.isPreparing = false;
    state.preparedOpParams = null;
  });

  builder.addCase(cancelSaplingPreparationAction, state => {
    state.isPreparing = false;
    state.preparedOpParams = null;
  });

  builder.addCase(loadSaplingTransactionHistoryActions.submit, (state, _action) => {
    for (const pkh of Object.keys(state.accountsRecord)) {
      if (state.accountsRecord[pkh].isCredentialsLoaded) {
        state.accountsRecord[pkh].isHistoryLoading = true;
      }
    }
  });

  builder.addCase(loadSaplingTransactionHistoryActions.success, (state, { payload }) => {
    const { publicKeyHash, transactions } = payload;
    state.accountsRecord[publicKeyHash].transactionHistory = transactions;
    state.accountsRecord[publicKeyHash].isHistoryLoading = false;
  });

  builder.addCase(loadSaplingTransactionHistoryActions.fail, (state, { payload: _error }) => {
    for (const pkh of Object.keys(state.accountsRecord)) {
      state.accountsRecord[pkh].isHistoryLoading = false;
    }
  });

  builder.addCase(clearPreparedOpParamsAction, state => {
    state.preparedOpParams = null;
  });

  builder.addCase(clearSaplingCredentialsAction, state => {
    state.accountsRecord = {};
  });

  // Clear transient preparation state on app restart/rehydration
  builder.addCase(REHYDRATE, state => {
    state.isPreparing = false;
    state.preparedOpParams = null;
  });
});

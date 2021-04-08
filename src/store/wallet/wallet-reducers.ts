import { createReducer } from '@reduxjs/toolkit';
import { walletInitialState, WalletState } from './wallet-state';
import { createWalletActions } from './wallet-actions';

export const walletsReducer = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(createWalletActions.success, (state, { payload }) => ({ ...state, hdAccounts: [payload] }));
});

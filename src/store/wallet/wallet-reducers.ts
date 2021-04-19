import { createReducer } from '@reduxjs/toolkit';

import { importWalletActions } from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';

export const walletsReducer = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(importWalletActions.success, (state, { payload }) => ({ ...state, hdAccounts: [payload] }));
});

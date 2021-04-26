import { createReducer } from '@reduxjs/toolkit';

import { addHdAccount } from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';

export const walletsReducer = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(addHdAccount, (state, { payload }) => ({ ...state, hdAccounts: [...state.hdAccounts, payload] }));
});

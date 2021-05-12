import { createReducer } from '@reduxjs/toolkit';

import { initialAccountSettings } from '../../interfaces/account-settings.interface';
import { addHdAccount, setSelectedAccount } from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';

export const walletsReducer = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(addHdAccount, (state, { payload }) => ({
    ...state,
    hdAccounts: [...state.hdAccounts, { ...payload, ...initialAccountSettings }]
  }));
  builder.addCase(setSelectedAccount, (state, { payload }) => ({ ...state, selectedAccountPublicKeyHash: payload ?? '' }));
});

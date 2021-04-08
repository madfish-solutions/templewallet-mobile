import { configureStore } from '@reduxjs/toolkit';
import { walletsReducer } from './wallet/wallet-reducers';
import { WalletRootState } from './wallet/wallet-state';
import { Middleware } from 'redux';

type RootState = WalletRootState;

const middlewares: Array<Middleware<{}, RootState>> = [];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

export const store = configureStore<RootState>({
  // @ts-ignore
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares),
  reducer: {
    wallet: walletsReducer
  }
});

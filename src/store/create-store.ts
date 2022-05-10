import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import createDebugger from 'redux-flipper';
import { combineEpics, createEpicMiddleware, Epic, StateObservable } from 'redux-observable';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistConfig } from 'redux-persist/lib/types';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { isDefined } from '../utils/is-defined';
import { bakingReducers } from './baking/baking-reducers';
import { BakingRootState } from './baking/baking-state';
import { currencyReducers } from './currency/currency-reducers';
import { CurrencyRootState } from './currency/currency-state';
import { dAppsReducers } from './d-apps/d-apps-reducers';
import { DAppsRootState } from './d-apps/d-apps-state';
import { rootStateReducer } from './root-state.reducers';
import { securityReducers } from './security/security-reducers';
import { SecurityRootState } from './security/security-state';
import { settingsReducers } from './settings/settings-reducers';
import { SettingsRootState } from './settings/settings-state';
import { walletReducers } from './wallet/wallet-reducers';
import { WalletRootState } from './wallet/wallet-state';

export type RootState = WalletRootState &
  BakingRootState &
  SettingsRootState &
  DAppsRootState &
  CurrencyRootState &
  SecurityRootState;

const epicMiddleware = createEpicMiddleware();
// eslint-disable-next-line @typescript-eslint/ban-types
const middlewares: Array<Middleware<{}, RootState>> = [epicMiddleware];

if (__DEV__ && !isDefined(process.env.JEST_WORKER_ID)) {
  middlewares.push(createDebugger());
}

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2
};

const rootReducer = rootStateReducer<RootState>({
  wallet: walletReducers,
  baking: bakingReducers,
  settings: settingsReducers,
  security: securityReducers,
  dApps: dAppsReducers,
  currency: currencyReducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createStore = (...epics: Epic[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootEpic = (action$: Observable<any>, store$: StateObservable<any>, dependencies: any) =>
    combineEpics(...epics)(action$, store$, dependencies).pipe(
      catchError((error, source) => {
        console.error(error);

        return source;
      })
    );

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      }).concat(middlewares);
    }
  });

  const persistor = persistStore(store);

  epicMiddleware.run(rootEpic);

  return { store, persistor };
};

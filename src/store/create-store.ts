import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import createDebugger from 'redux-flipper';
import { ActionsObservable, combineEpics, createEpicMiddleware, Epic, StateObservable } from 'redux-observable';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { catchError } from 'rxjs/operators';

import { activityReducers } from './activity/activity-reducers';
import { ActivityRootState } from './activity/activity-state';
import { bakingReducers } from './baking/baking-reducers';
import { BakingRootState } from './baking/baking-state';
import { dAppsReducers } from './d-apps/d-apps-reducers';
import { DAppsRootState } from './d-apps/d-apps-state';
import { rootStateReducer } from './root-state.reducers';
import { settingsReducers } from './settings/settings-reducers';
import { SettingsRootState } from './settings/settings-state';
import { walletReducers } from './wallet/wallet-reducers';
import { WalletRootState } from './wallet/wallet-state';

export type RootState = WalletRootState & BakingRootState & SettingsRootState & ActivityRootState & DAppsRootState;

const epicMiddleware = createEpicMiddleware();
// eslint-disable-next-line @typescript-eslint/ban-types
const middlewares: Array<Middleware<{}, RootState>> = [epicMiddleware];

if (__DEV__ && !process.env.JEST_WORKER_ID) {
  middlewares.push(createDebugger());
}

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage
};

const rootReducer = rootStateReducer<RootState>({
  wallet: walletReducers,
  baking: bakingReducers,
  settings: settingsReducers,
  activity: activityReducers,
  dApps: dAppsReducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createStore = (...epics: Epic[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootEpic = (action$: ActionsObservable<any>, store$: StateObservable<any>, dependencies: any) =>
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

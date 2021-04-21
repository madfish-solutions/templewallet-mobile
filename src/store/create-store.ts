import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { ActionsObservable, combineEpics, createEpicMiddleware, Epic, StateObservable } from 'redux-observable';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { catchError } from 'rxjs/operators';

import { assetsReducer } from './assets/assets-reducers';
import { AssetsRootState } from './assets/assets-state';
import { rootStateReducer } from './root-state.reducers';
import { walletsReducer } from './wallet/wallet-reducers';
import { WalletRootState } from './wallet/wallet-state';

type RootState = WalletRootState & AssetsRootState;

const epicMiddleware = createEpicMiddleware();
const middlewares: Array<Middleware<{}, RootState>> = [epicMiddleware];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage
};

const rootReducer = rootStateReducer({
  wallet: walletsReducer,
  assets: assetsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createStore = (...epics: Epic[]) => {
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

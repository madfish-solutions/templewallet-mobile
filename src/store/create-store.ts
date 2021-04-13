import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { ActionsObservable, combineEpics, createEpicMiddleware, Epic, StateObservable } from 'redux-observable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import { walletsReducer } from './wallet/wallet-reducers';
import { WalletRootState } from './wallet/wallet-state';
import { catchError } from 'rxjs/operators';
import { rootStateReducer } from './root-state.reducers';

type RootState = WalletRootState;

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
  wallet: walletsReducer
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

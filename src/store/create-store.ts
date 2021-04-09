import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { ActionsObservable, combineEpics, createEpicMiddleware, Epic, StateObservable } from 'redux-observable';

import { walletsReducer } from './wallet/wallet-reducers';
import { WalletRootState } from './wallet/wallet-state';
import { catchError } from 'rxjs/operators';

type RootState = WalletRootState;

const epicMiddleware = createEpicMiddleware();
const middlewares: Array<Middleware<{}, RootState>> = [epicMiddleware];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

export const createStore = (...epics: Epic[]) => {
  const rootEpic = (action$: ActionsObservable<any>, store$: StateObservable<any>, dependencies: any) =>
    combineEpics(...epics)(action$, store$, dependencies).pipe(
      catchError((error, source) => {
        console.error(error);
        return source;
      })
    );

  const store = configureStore<RootState>({
    // @ts-ignore
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares),
    reducer: {
      wallet: walletsReducer
    }
  });

  epicMiddleware.run(rootEpic);

  return store;
};

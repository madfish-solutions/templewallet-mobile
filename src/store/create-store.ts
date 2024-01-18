import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from 'redux';
import createDebugger from 'redux-flipper';
import { combineEpics, createEpicMiddleware, Epic, StateObservable } from 'redux-observable';
import { persistStore } from 'redux-persist';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { isDefined } from 'src/utils/is-defined';

import persistedReducer from './root-state.reducers';
import type { RootState } from './types';

const epicMiddleware = createEpicMiddleware();
// eslint-disable-next-line @typescript-eslint/ban-types
const middlewares: Array<Middleware<{}, RootState>> = [epicMiddleware];

if (__DEV__ && !isDefined(process.env.JEST_WORKER_ID)) {
  middlewares.push(createDebugger());
}

export const createStore = (...epics: Epic[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootEpic = (action$: Observable<any>, store$: StateObservable<any>, dependencies: any) =>
    combineEpics(...epics)(action$, store$, dependencies).pipe(catchError((error, source) => source));

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
      }).concat(middlewares);
    }
  });

  const persistor = persistStore(store);

  epicMiddleware.run(rootEpic);

  return { store, persistor };
};

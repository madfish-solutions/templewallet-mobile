import { AnyAction, configureStore, ThunkMiddleware } from '@reduxjs/toolkit';
import type { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware, Epic, StateObservable } from 'redux-observable';
import { persistStore } from 'redux-persist';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { isDefined } from 'src/utils/is-defined';

import persistedReducer from './root-state.reducers';
import { RootState } from './types';

const epicMiddleware = createEpicMiddleware();
const middlewares: Middleware<object, RootState>[] = [epicMiddleware];

if (__DEV__ && !isDefined(process.env.JEST_WORKER_ID)) {
  middlewares.push(createLogger({ diff: true, collapsed: true }));
}

export const createStore = (...epics: Epic[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootEpic = (action$: Observable<any>, store$: StateObservable<any>, dependencies: any) =>
    combineEpics(...epics)(action$, store$, dependencies).pipe(catchError((_error, source) => source));

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
      }).concat(middlewares as ThunkMiddleware<RootState, AnyAction>[]);
    }
  });

  const persistor = persistStore(store);

  epicMiddleware.run(rootEpic);

  return { store, persistor };
};

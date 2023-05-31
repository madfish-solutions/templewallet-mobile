import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import type { CombinedState } from '@reduxjs/toolkit';
import type { Middleware, Reducer } from 'redux';
import createDebugger from 'redux-flipper';
import { combineEpics, createEpicMiddleware, Epic, StateObservable } from 'redux-observable';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistConfig } from 'redux-persist/lib/types';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { isDefined } from '../utils/is-defined';
import { abTestingReducer } from './ab-testing/ab-testing-reducers';
import { advertisingReducers } from './advertising/advertising-reducers';
import { bakingReducers } from './baking/baking-reducers';
import { buyWithCreditCardReducer } from './buy-with-credit-card/reducers';
import { contactBookReducers } from './contact-book/contact-book-reducers';
import { currencyReducers } from './currency/currency-reducers';
import { dAppsReducers } from './d-apps/d-apps-reducers';
import { exolixReducers } from './exolix/exolix-reducers';
import { marketReducers } from './market/market-reducers';
import { notificationsReducers } from './notifications/notifications-reducers';
import { partnersPromotionReducers } from './partners-promotion/partners-promotion-reducers';
import { rootStateReducer } from './root-state.reducers';
import { securityReducers } from './security/security-reducers';
import { settingsReducers } from './settings/settings-reducers';
import { swapReducer } from './swap/swap-reducers';
import { tokensMetadataReducers } from './tokens-metadata/tokens-metadata-reducers';
import { walletReducers } from './wallet/wallet-reducers';

const rootReducer = rootStateReducer({
  wallet: walletReducers,
  tokensMetadata: tokensMetadataReducers,
  baking: bakingReducers,
  settings: settingsReducers,
  security: securityReducers,
  dApps: dAppsReducers,
  currency: currencyReducers,
  exolix: exolixReducers,
  advertising: advertisingReducers,
  market: marketReducers,
  notifications: notificationsReducers,
  swap: swapReducer,
  contactBook: contactBookReducers,
  buyWithCreditCard: buyWithCreditCardReducer,
  partnersPromotion: partnersPromotionReducers,
  abTesting: abTestingReducer
});

export type RootState = typeof rootReducer extends Reducer<CombinedState<infer S>> ? S : never;

const epicMiddleware = createEpicMiddleware();
// eslint-disable-next-line @typescript-eslint/ban-types
const middlewares: Array<Middleware<{}, RootState>> = [epicMiddleware];

if (__DEV__ && !isDefined(process.env.JEST_WORKER_ID)) {
  middlewares.push(createDebugger());
}

const persistConfigBlacklist: (keyof RootState)[] = ['buyWithCreditCard', 'exolix'];

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  blacklist: persistConfigBlacklist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createStore = (...epics: Epic[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootEpic = (action$: Observable<any>, store$: StateObservable<any>, dependencies: any) =>
    combineEpics(...epics)(action$, store$, dependencies).pipe(catchError((error, source) => source));

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          warnAfter: 300
        },
        immutableCheck: {
          warnAfter: 300
        }
      }).concat(middlewares);
    }
  });

  const persistor = persistStore(store);

  epicMiddleware.run(rootEpic);

  return { store, persistor };
};

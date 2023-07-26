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
import { abTestingReducer } from './ab-testing/ab-testing-reducers';
import { ABTestingRootState } from './ab-testing/ab-testing-state';
import { advertisingReducers } from './advertising/advertising-reducers';
import { AdvertisingRootState } from './advertising/advertising-state';
import { bakingReducers } from './baking/baking-reducers';
import { BakingRootState } from './baking/baking-state';
import { buyWithCreditCardReducer } from './buy-with-credit-card/reducers';
import { BuyWithCreditCardRootState } from './buy-with-credit-card/state';
import { collectiblesReducers } from './collectibles/collectibles-reducers';
import { CollectiblesRootState } from './collectibles/collectibles-state';
import { collectionsReducer } from './collectons/collections-reducers';
import { CollectionsRootState } from './collectons/collections-state';
import { contactBookReducers } from './contact-book/contact-book-reducers';
import { ContactsBookRootState } from './contact-book/contact-book-state';
import { currencyReducers } from './currency/currency-reducers';
import { CurrencyRootState } from './currency/currency-state';
import { dAppsReducers } from './d-apps/d-apps-reducers';
import { DAppsRootState } from './d-apps/d-apps-state';
import { exolixReducers } from './exolix/exolix-reducers';
import { ExolixRootState } from './exolix/exolix-state';
import { marketReducers } from './market/market-reducers';
import { MarketRootState } from './market/market-state';
import { notificationsReducers } from './notifications/notifications-reducers';
import { NotificationsRootState } from './notifications/notifications-state';
import { partnersPromotionReducers } from './partners-promotion/partners-promotion-reducers';
import { PartnersPromotionRootState } from './partners-promotion/partners-promotion-state';
import { rootStateReducer } from './root-state.reducers';
import { securityReducers } from './security/security-reducers';
import { SecurityRootState } from './security/security-state';
import { settingsReducers } from './settings/settings-reducers';
import { SettingsRootState } from './settings/settings-state';
import { swapReducer } from './swap/swap-reducers';
import { Route3RootState } from './swap/swap-state';
import { tokensMetadataReducers } from './tokens-metadata/tokens-metadata-reducers';
import { TokensMetadataRootState } from './tokens-metadata/tokens-metadata-state';
import { walletReducers } from './wallet/wallet-reducers';
import { WalletRootState } from './wallet/wallet-state';

export type RootState = WalletRootState &
  TokensMetadataRootState &
  BakingRootState &
  SettingsRootState &
  DAppsRootState &
  CurrencyRootState &
  SecurityRootState &
  ExolixRootState &
  AdvertisingRootState &
  MarketRootState &
  NotificationsRootState &
  ContactsBookRootState &
  CollectionsRootState &
  Route3RootState &
  BuyWithCreditCardRootState &
  PartnersPromotionRootState &
  Route3RootState &
  ABTestingRootState &
  CollectiblesRootState;

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
  stateReconciler: autoMergeLevel2,
  blacklist: ['collections']
};

const rootReducer = rootStateReducer<RootState>({
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
  collections: collectionsReducer,
  buyWithCreditCard: buyWithCreditCardReducer,
  partnersPromotion: partnersPromotionReducers,
  abTesting: abTestingReducer,
  collectibles: collectiblesReducers
});

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

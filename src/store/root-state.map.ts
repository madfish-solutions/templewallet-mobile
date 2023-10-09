import { abTestingReducer } from './ab-testing/ab-testing-reducers';
import { advertisingReducers } from './advertising/advertising-reducers';
import { bakingReducers } from './baking/baking-reducers';
import { buyWithCreditCardReducer } from './buy-with-credit-card/reducers';
import { collectiblesPersistedReducer } from './collectibles/collectibles-reducers';
import { collectionsReducer } from './collectons/collections-reducers';
import { contactBookReducers } from './contact-book/contact-book-reducers';
import { currencyReducers } from './currency/currency-reducers';
import { dAppsReducers } from './d-apps/d-apps-reducers';
import { exolixReducers } from './exolix/exolix-reducers';
import { farmsReducer } from './farms/reducers';
import { marketReducers } from './market/market-reducers';
import { newsletterReducers } from './newsletter/newsletter-reducers';
import { notificationsReducers } from './notifications/notifications-reducers';
import { partnersPromotionReducers } from './partners-promotion/partners-promotion-reducers';
import { savingsReducer } from './savings/reducers';
import { securityReducers } from './security/security-reducers';
import { settingsReducers } from './settings/settings-reducers';
import { swapReducer } from './swap/swap-reducers';
import { tokensMetadataReducers } from './tokens-metadata/tokens-metadata-reducers';
import { walletReducers } from './wallet/wallet-reducers';

export const rootStateReducersMap = {
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
  abTesting: abTestingReducer,
  farms: farmsReducer,
  savings: savingsReducer,
  newsletter: newsletterReducers,
  collections: collectionsReducer,
  collectibles: collectiblesPersistedReducer
};

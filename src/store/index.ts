import { abTestingEpics } from './ab-testing/ab-testing-epics';
import { advertisingEpics } from './advertising/advertising-epics';
import { bakingEpics } from './baking/baking-epics';
import { buyWithCreditCardEpics } from './buy-with-credit-card/epics';
import { collectiblesEpics } from './collectibles/collectibles-epics';
import { collectionsEpics } from './collectons/collections-epics';
import { contactsEpics } from './contact-book/contact-book-epics';
import { createStore } from './create-store';
import { currencyEpics } from './currency/currency-epics';
import { dAppsEpics } from './d-apps/d-apps-epics';
import { exolixEpics } from './exolix/exolix-epics';
import { farmsEpics } from './farms/epics';
import { marketEpics } from './market/market-epics';
import { notificationsEpics } from './notifications/notifications-epics';
import { rootStateEpics } from './root-state.epics';
import { savingsEpics } from './savings/epics';
import { securityEpics } from './security/security-epics';
import { settingsEpic } from './settings/settings-epic';
import { swapEpics } from './swap/swap-epics';
import { tokensMetadataEpics } from './tokens-metadata/tokens-metadata-epics';
import { walletEpics } from './wallet/wallet-epics';

export const { store, persistor } = createStore(
  rootStateEpics,
  walletEpics,
  tokensMetadataEpics,
  bakingEpics,
  exolixEpics,
  dAppsEpics,
  settingsEpic,
  currencyEpics,
  securityEpics,
  advertisingEpics,
  marketEpics,
  notificationsEpics,
  swapEpics,
  contactsEpics,
  collectionsEpics,
  buyWithCreditCardEpics,
  abTestingEpics,
  collectiblesEpics,
  farmsEpics,
  savingsEpics
);

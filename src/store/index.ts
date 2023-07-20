import { abTestingEpics } from './ab-testing/ab-testing-epics';
import { advertisingEpics } from './advertising/advertising-epics';
import { bakingEpics } from './baking/baking-epics';
import { buyWithCreditCardEpics } from './buy-with-credit-card/epics';
import { contactsEpics } from './contact-book/contact-book-epics';
import { createStore } from './create-store';
import { currencyEpics } from './currency/currency-epics';
import { dAppsEpics } from './d-apps/d-apps-epics';
import { exolixEpics } from './exolix/exolix-epics';
import { farmsEpics } from './farms/epics';
import { marketEpics } from './market/market-epics';
import { migrationEpics } from './migration/migration-epics';
import { notificationsEpics } from './notifications/notifications-epics';
import { partnersPromotionEpics } from './partners-promotion/partners-promotion-epics';
import { rootStateEpics } from './root-state.epics';
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
  migrationEpics,
  advertisingEpics,
  marketEpics,
  notificationsEpics,
  swapEpics,
  contactsEpics,
  buyWithCreditCardEpics,
  partnersPromotionEpics,
  abTestingEpics,
  farmsEpics
);

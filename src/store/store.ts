import { advertisingEpics } from './advertising/advertising-epics';
import { bakingEpics } from './baking/baking-epics';
import { createStore } from './create-store';
import { currencyEpics } from './currency/currency-epics';
import { dAppsEpics } from './d-apps/d-apps-epics';
import { exolixEpics } from './exolix/exolix-epics';
import { migrationEpics } from './migration/migration-epics';
import { notificationsEpics } from './notifications/notifications-epics';
import { rootStateEpics } from './root-state.epics';
import { securityEpics } from './security/security-epics';
import { settingsEpic } from './settings/settings-epic';
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
  notificationsEpics
);

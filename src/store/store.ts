import { appCheckEpics } from './app-check/app-check-epics';
import { bakingEpics } from './baking/baking-epics';
import { createStore } from './create-store';
import { currencyEpics } from './currency/currency-epics';
import { dAppsEpics } from './d-apps/d-apps-epics';
import { debugEpics } from './debug/debug-epics';
import { rootStateEpics } from './root-state.epics';
import { settingsEpic } from './settings/settings-epic';
import { walletEpics } from './wallet/wallet-epics';

export const { store, persistor } = createStore(
  rootStateEpics,
  walletEpics,
  bakingEpics,
  dAppsEpics,
  debugEpics,
  settingsEpic,
  currencyEpics,
  appCheckEpics
);

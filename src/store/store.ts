import { activityEpics } from './activity/activity-epics';
import { bakingEpics } from './baking/baking-epics';
import { createStore } from './create-store';
import { rootStateEpics } from './root-state.epics';
import { walletEpics } from './wallet/wallet-epics';

export const { store, persistor } = createStore(rootStateEpics, walletEpics, bakingEpics, activityEpics);

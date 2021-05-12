import { createStore } from './create-store';
import { rootStateEpics } from './root-state.epics';
import { assetsEpics } from './wallet/assets-epics';

export const { store, persistor } = createStore(rootStateEpics, assetsEpics);

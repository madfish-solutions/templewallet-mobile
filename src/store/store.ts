import { loadAssetsEpic } from './assets/assets-epics';
import { createStore } from './create-store';
import { rootStateEpics } from './root-state.epics';

export const { store, persistor } = createStore(rootStateEpics, loadAssetsEpic);

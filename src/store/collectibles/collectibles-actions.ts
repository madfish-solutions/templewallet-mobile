import { createActions } from '../create-actions';
import type { CollectibleDetailsRecord } from './collectibles-state';

export const loadCollectiblesDetailsActions = createActions<string[], CollectibleDetailsRecord, string>(
  'collectibles/LOAD_COLLECTIBLES_DETAILS'
);

import { createActions } from '../create-actions';
import type { CollectibleDetailsRecord } from './collectibles-state';

export const loadCollectiblesDetailsActions = createActions<
  string[],
  {
    details: CollectibleDetailsRecord;
    /** In milliseconds */
    timestamp: number;
  },
  string
>('collectibles/LOAD_COLLECTIBLES_DETAILS');

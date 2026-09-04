import { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';

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

/** A trapdoor for loading single collectible details beyond the general queue */
export const loadOneCollectibleDetailsActions = createActions<
  string,
  { slug: string; details: CollectibleDetailsInterface | null; timestamp: number },
  string
>('collectibles/LOAD_ONE_COLLECTIBLE_DETAILS');

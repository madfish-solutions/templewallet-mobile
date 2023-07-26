import { CollectibleDetailsInterface } from '../../token/interfaces/collectible-interfaces.interface';
import { createActions } from '../create-actions';

export const loadCollectiblesDetailsActions = createActions<
  string[],
  Record<string, CollectibleDetailsInterface>,
  string
>('collectibles/LOAD_COLLECTIBLES_DETAILS');

export const loadCollectibleDetailsActions = createActions<
  { address: string; id: string },
  Record<string, CollectibleDetailsInterface>,
  string
>('collectibles/LOAD_COLLECTIBLE_DETAILS');

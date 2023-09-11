import { CollectibleDetailsInterface } from '../../token/interfaces/collectible-interfaces.interface';
import { createActions } from '../create-actions';

export const loadCollectiblesDetailsActions = createActions<
  string[],
  Record<string, CollectibleDetailsInterface>,
  string
>('collectibles/LOAD_COLLECTIBLES_DETAILS');

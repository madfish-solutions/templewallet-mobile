import {
  CollectibleDetailsInterface,
  CollectibleInterface
} from '../../token/interfaces/collectible-interfaces.interface';
import { createActions } from '../create-actions';

export const loadCollectiblesDetailsActions = createActions<
  string[],
  Record<string, CollectibleDetailsInterface>,
  string
>('collectibles/LOAD_COLLECTIBLES_DETAILS');

export const updateCollectibleDetailsAction = createActions<CollectibleInterface, string, string>(
  'collectibles/UPDATE_COLLECTIBLES_DETAILS'
);

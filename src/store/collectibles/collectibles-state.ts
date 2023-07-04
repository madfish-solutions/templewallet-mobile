import { CollectibleDetailsInterface } from '../../token/interfaces/collectible-interfaces.interface';
import { LoadableEntityState } from '../types';

export interface CollectiblesState {
  details: Record<string, CollectibleDetailsInterface>;
}

export const collectiblesInitialState: CollectiblesState = {
  details: {}
};

export interface CollectiblesRootState {
  collectibles: CollectiblesState;
}

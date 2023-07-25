import { CollectibleDetailsInterface } from '../../token/interfaces/collectible-interfaces.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface CollectiblesState {
  details: LoadableEntityState<Record<string, CollectibleDetailsInterface>>;
}

export const collectiblesInitialState: CollectiblesState = {
  details: createEntity({})
};

export interface CollectiblesRootState {
  collectibles: CollectiblesState;
}

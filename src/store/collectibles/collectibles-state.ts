import { CollectibleDetailsInterface } from '../../token/interfaces/collectible-interfaces.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type CollectibleDetailsRecord = Record<string, CollectibleDetailsInterface | null>;

export interface CollectiblesState {
  details: LoadableEntityState<CollectibleDetailsRecord>;
}

export const collectiblesInitialState: CollectiblesState = {
  details: createEntity({})
};

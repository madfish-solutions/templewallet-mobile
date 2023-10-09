import { CollectibleDetailsInterface } from '../../token/interfaces/collectible-interfaces.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type CollectibleDetailsRecord = Record<string, CollectibleDetailsInterface | null>;

export interface CollectiblesState {
  details: LoadableEntityState<CollectibleDetailsRecord>;
  adultFlags: Record<string, AdultFlag>;
}

interface AdultFlag {
  val: boolean;
  /** Timestamp in seconds */
  ts: number;
}

export const collectiblesInitialState: CollectiblesState = {
  details: createEntity({}),
  adultFlags: {}
};

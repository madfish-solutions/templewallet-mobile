import { BakerInterface, emptyBaker } from '../../interfaces/baker.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface BakingState {
  selectedBaker: LoadableEntityState<BakerInterface>;
  bakersList: LoadableEntityState<BakerInterface[]>;
}

export const bakingInitialState: BakingState = {
  selectedBaker: createEntity(emptyBaker),
  bakersList: createEntity([])
};

export interface BakingRootState {
  baking: BakingState;
}

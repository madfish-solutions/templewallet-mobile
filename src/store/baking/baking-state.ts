import { BakerInterface, emptyBaker } from '../../interfaces/baker.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface BakingState {
  selectedBaker: BakerInterface;
  bakersList: LoadableEntityState<BakerInterface[]>;
}

export const bakingInitialState: BakingState = {
  selectedBaker: emptyBaker,
  bakersList: createEntity([])
};

export interface BakingRootState {
  baking: BakingState;
}

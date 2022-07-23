import { BakerRewardInterface } from '../../interfaces/baker-reward.interface';
import { BakerInterface, emptyBaker } from '../../interfaces/baker.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface BakingState {
  selectedBaker: BakerInterface;
  bakersList: LoadableEntityState<BakerInterface[]>;
  bakerRewardsList: LoadableEntityState<BakerRewardInterface[]>;
}

export const bakingInitialState: BakingState = {
  selectedBaker: emptyBaker,
  bakersList: createEntity([]),
  bakerRewardsList: createEntity([])
};

export interface BakingRootState {
  baking: BakingState;
}

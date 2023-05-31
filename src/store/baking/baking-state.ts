import { BakerInterface, emptyBaker } from 'src/apis/baking-bad';
import { BakerRewardInterface } from 'src/interfaces/baker-reward.interface';

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

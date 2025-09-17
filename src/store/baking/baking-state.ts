import { BakerInterface } from 'src/apis/baking-bad';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface BakingState {
  selectedBaker?: BakerInterface;
  bakersList: LoadableEntityState<BakerInterface[]>;
  /** @deprecated */
  bakerRewardsList?: [];
}

export const bakingInitialState: BakingState = {
  bakersList: createEntity([])
};

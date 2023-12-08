import { mockBaker } from 'src/apis/baking-bad';
import { mockBakerReward } from 'src/interfaces/baker-reward.interface.mock';

import { createEntity } from '../create-entity';

import { BakingState } from './baking-state';

export const mockBakingState: BakingState = {
  bakersList: createEntity([mockBaker]),
  bakerRewardsList: createEntity([mockBakerReward])
};

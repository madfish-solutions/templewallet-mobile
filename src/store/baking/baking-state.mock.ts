import { mockBakerReward } from '../../interfaces/baker-reward.interface.mock';
import { mockBaker } from '../../interfaces/baker.interface.mock';
import { createEntity } from '../create-entity';
import { BakingState } from './baking-state';

export const mockBakingState: BakingState = {
  selectedBaker: mockBaker,
  bakersList: createEntity([mockBaker]),
  bakerRewardsList: createEntity([mockBakerReward])
};

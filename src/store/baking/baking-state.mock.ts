import { mockBaker } from 'src/apis/baking-bad';

import { createEntity } from '../create-entity';

import { BakingState } from './baking-state';

export const mockBakingState: BakingState = {
  bakersList: createEntity([mockBaker])
};

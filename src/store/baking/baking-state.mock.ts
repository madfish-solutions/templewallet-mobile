import { mockBaker } from '../../interfaces/baker.interface.mock';
import { createEntity } from '../create-entity';
import { BakingState } from './baking-state';

export const mockBakingState: BakingState = {
  selectedBaker: createEntity(mockBaker),
  bakersList: createEntity([mockBaker])
};

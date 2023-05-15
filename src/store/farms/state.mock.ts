import { createEntity } from '../create-entity';
import { FarmsState } from './state';

export const mockFarmsState: FarmsState = {
  farms: createEntity({ list: [] }),
  allFarms: createEntity([]),
  lastStakes: {}
};

import { createEntity } from '../create-entity';
import { SavingsState } from './state';

export const mockSavingsState: SavingsState = {
  stakes: createEntity({}),
  allSavingsItems: createEntity([])
};

import { createEntity } from '../create-entity';
import { AppCheckState } from './app-check-state';

export const mockAppCheckState: AppCheckState = {
  checkInfo: createEntity({ isForceUpdateNeeded: false })
};

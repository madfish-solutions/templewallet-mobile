import { mockDApp } from '../../interfaces/d-app.interface.mock';
import { QUIPU_DEFAULT_PERCENTAGE } from '../../utils/quipu-apy.util';
import { createEntity } from '../create-entity';
import { DAppsState } from './d-apps-state';

export const mockDAppsState: DAppsState = {
  permissions: createEntity([]),
  dappsList: createEntity([mockDApp]),
  quipuApy: QUIPU_DEFAULT_PERCENTAGE
};

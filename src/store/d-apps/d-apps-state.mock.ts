import { mockDApp } from '../../interfaces/d-app.interface.mock';
import { createEntity } from '../create-entity';
import { DAppsState } from './d-apps-state';

export const mockDAppsState: DAppsState = {
  permissions: createEntity([]),
  dappsList: createEntity([mockDApp])
};

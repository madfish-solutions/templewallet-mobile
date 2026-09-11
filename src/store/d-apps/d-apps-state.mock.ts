import { mockDApp } from '../../interfaces/custom-dapps-info.mock';
import { createEntity } from '../create-entity';

import { DAppsState } from './d-apps-state';

export const mockDAppsState: DAppsState = {
  connections: createEntity([]),
  dappsList: createEntity([mockDApp]),
  tokensApyRates: {}
};

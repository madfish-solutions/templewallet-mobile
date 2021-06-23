import { PermissionInfo } from '@airgap/beacon-sdk';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface DAppsState {
  permissions: LoadableEntityState<PermissionInfo[]>;
}

export const dAppsInitialState: DAppsState = {
  permissions: createEntity([])
};

export interface DAppsRootState {
  dApps: DAppsState;
}

import { PermissionInfo } from '@airgap/beacon-sdk';

import { CustomDAppInfo } from '../../interfaces/custom-dapps-info.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface DAppsState {
  permissions: LoadableEntityState<PermissionInfo[]>;
  dappsList: LoadableEntityState<CustomDAppInfo[]>;
}

export const dAppsInitialState: DAppsState = {
  permissions: createEntity([]),
  dappsList: createEntity([])
};

export interface DAppsRootState {
  dApps: DAppsState;
}

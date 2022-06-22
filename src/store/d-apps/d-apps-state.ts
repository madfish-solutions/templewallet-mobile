import { PermissionInfo } from '@airgap/beacon-sdk';

import { CustomDAppInfo } from '../../interfaces/custom-dapps-info.interface';
import { QUIPU_DEFAULT_PERCENTAGE } from '../../utils/quipu-apy.util';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface DAppsState {
  permissions: LoadableEntityState<PermissionInfo[]>;
  dappsList: LoadableEntityState<CustomDAppInfo[]>;
  quipuApy: number;
}

export const dAppsInitialState: DAppsState = {
  permissions: createEntity([]),
  dappsList: createEntity([]),
  quipuApy: QUIPU_DEFAULT_PERCENTAGE
};

export interface DAppsRootState {
  dApps: DAppsState;
}

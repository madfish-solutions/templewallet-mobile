import { PermissionInfo, ExtendedPeerInfo } from '@airgap/beacon-sdk';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface DAppsState {
  permissions: LoadableEntityState<PermissionInfo[]>;
  peers: LoadableEntityState<ExtendedPeerInfo[]>;
}

export const dAppsInitialState: DAppsState = {
  permissions: createEntity([]),
  peers: createEntity([])
};

export interface DAppsRootState {
  dApps: DAppsState;
}

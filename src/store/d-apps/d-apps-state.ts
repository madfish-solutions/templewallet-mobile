import { PermissionInfo } from '@airgap/beacon-sdk';

import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

type TokenSlug = string;
type TokensApyInfo = Record<TokenSlug, { rate: number }>;

export interface DAppsState {
  permissions: LoadableEntityState<PermissionInfo[]>;
  dappsList: LoadableEntityState<CustomDAppInfo[]>;
  tokensApyInfo: TokensApyInfo;
}

export const dAppsInitialState: DAppsState = {
  permissions: createEntity([]),
  dappsList: createEntity([]),
  tokensApyInfo: {}
};

export interface DAppsRootState {
  dApps: DAppsState;
}

import { PermissionInfo } from '@airgap/beacon-sdk';

import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

type TokenSlug = string;

export interface DAppsState {
  permissions: LoadableEntityState<PermissionInfo[]>;
  dappsList: LoadableEntityState<CustomDAppInfo[]>;
  tokensApyRates: Record<TokenSlug, number>;
}

export const dAppsInitialState: DAppsState = {
  permissions: createEntity([]),
  dappsList: createEntity([]),
  tokensApyRates: {}
};

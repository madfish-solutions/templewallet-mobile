import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';
import { DAppConnection } from 'src/interfaces/dapp-connection.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

type TokenSlug = string;

export interface DAppsState {
  connections: LoadableEntityState<DAppConnection[]>;
  dappsList: LoadableEntityState<CustomDAppInfo[]>;
  tokensApyRates: Record<TokenSlug, number>;
}

export const dAppsInitialState: DAppsState = {
  connections: createEntity([]),
  dappsList: createEntity([]),
  tokensApyRates: {}
};

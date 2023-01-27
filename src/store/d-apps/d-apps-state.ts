import { PermissionInfo } from '@airgap/beacon-sdk';

import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { YUPANA_LINK } from 'src/utils/constants/apy';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

type TokenSlug = string;
type TokensApyInfo = Record<TokenSlug, { rate: number; link: string }>;

export interface DAppsState {
  permissions: LoadableEntityState<PermissionInfo[]>;
  dappsList: LoadableEntityState<CustomDAppInfo[]>;
  tokensApyInfo: TokensApyInfo;
}

export const dAppsInitialState: DAppsState = {
  permissions: createEntity([]),
  dappsList: createEntity([]),
  tokensApyInfo: {
    [KNOWN_TOKENS_SLUGS.KUSD]: {
      rate: 0,
      link: YUPANA_LINK
    },
    [KNOWN_TOKENS_SLUGS.tzBTC]: {
      rate: 0,
      link: YUPANA_LINK
    }
  }
};

export interface DAppsRootState {
  dApps: DAppsState;
}

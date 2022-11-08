import { PermissionInfo } from '@airgap/beacon-sdk';

import { CustomDAppInfo } from '../../interfaces/custom-dapps-info.interface';
import { TZ_BTC_SLUG, KUSD_SLUG } from '../../token/data/token-slugs';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';
import { YUPANA_LINK, KORDFI_LINK } from './constants';

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
    [KUSD_SLUG]: {
      rate: 0,
      link: YUPANA_LINK
    },
    [TZ_BTC_SLUG]: {
      rate: 0,
      link: KORDFI_LINK
    }
  }
};

export interface DAppsRootState {
  dApps: DAppsState;
}

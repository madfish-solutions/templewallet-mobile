import { createEntity } from '../store/create-entity';
import { LoadableEntityState } from '../store/types';
import { MAINNET_TOKENS_METADATA } from '../token/data/tokens-metadata';
import { AccountTokenInterface } from '../token/interfaces/account-token.interface';
import { tokenMetadataSlug } from '../token/utils/token.utils';
import { ActivityGroup } from './activity.interface';

export interface AccountStateInterface {
  tezosBalance: LoadableEntityState<string>;
  tokensList: AccountTokenInterface[];
  activityGroups: LoadableEntityState<ActivityGroup[]>;
  pendingActivities: ActivityGroup[];
}

export const initialAccountState: AccountStateInterface = {
  tezosBalance: createEntity('0'),
  tokensList: MAINNET_TOKENS_METADATA.map(token => ({ slug: tokenMetadataSlug(token), balance: '0', isVisible: true })),
  activityGroups: createEntity([]),
  pendingActivities: []
};

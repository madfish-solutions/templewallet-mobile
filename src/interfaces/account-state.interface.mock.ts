import { createEntity } from '../store/create-entity';
import { mockAccountTokens } from '../token/interfaces/account-token.interface.mock';
import { AccountStateInterface } from './account-state.interface';
import { mockActivityGroup } from './activity.interface.mock';

export const mockAccountState: AccountStateInterface = {
  tezosBalance: createEntity('100'),
  tokensList: mockAccountTokens,
  activityGroups: createEntity(mockActivityGroup),
  pendingActivities: []
};

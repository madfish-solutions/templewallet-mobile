import { createEntity } from '../store/create-entity';
import { mockAccountTokens } from '../token/interfaces/account-token.interface.mock';
import { AccountStateInterface } from './account-state.interface';
import { mockAppliedActivityGroups, mockPendingActivityGroups } from './activity.interface.mock';

export const mockAccountState: AccountStateInterface = {
  isVisible: true,
  tezosBalance: '100',
  tokensList: mockAccountTokens,
  removedTokensList: [],
  activityGroups: createEntity(mockAppliedActivityGroups),
  pendingActivities: mockPendingActivityGroups
};

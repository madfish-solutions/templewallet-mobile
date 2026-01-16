import { ABTestGroup } from 'src/apis/temple-wallet';

import { createActions } from '../create-actions';

export const getUserTestingGroupNameActions = createActions<void, ABTestGroup, string>(
  'abtesting/GET_USER_TESTING_GROUP_NAME'
);

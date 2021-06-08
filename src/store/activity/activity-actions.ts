import { ActivityGroup } from '../../interfaces/activity.interface';
import { createActions } from '../create-actions';

export const loadActivityGroupsActions = createActions<string, ActivityGroup[], string>(
  'activity/LOAD_ACTIVITY_GROUPS'
);

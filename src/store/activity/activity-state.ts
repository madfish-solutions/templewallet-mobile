import { ActivityGroup } from '../../interfaces/activity.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface ActivityState {
  activityGroups: LoadableEntityState<ActivityGroup[]>;
  pendingOperations: ActivityGroup[];
}

export const activityInitialState: ActivityState = {
  activityGroups: createEntity([]),
  pendingOperations: []
};

export interface ActivityRootState {
  activity: ActivityState;
}

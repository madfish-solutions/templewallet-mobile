import { ActivityGroup } from '../../interfaces/activity.interface';

export interface ActivityState {
  pendingActivities: ActivityGroup[];
}

export const activityInitialState: ActivityState = {
  pendingActivities: []
};

export interface ActivityRootState {
  activity: ActivityState;
}

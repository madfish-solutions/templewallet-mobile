import { ActivityInterface } from '../../interfaces/activity.interface';

export interface ActivityState {
  pendingActivities: ActivityInterface[];
}

export const activityInitialState: ActivityState = {
  pendingActivities: []
};

export interface ActivityRootState {
  activity: ActivityState;
}

import { BehaviorSubject } from 'rxjs';

import { ActivityGroup, ActivityInterface, emptyActivity } from '../interfaces/activity.interface';

export const groupActivitiesByHash = (operations: ActivityInterface[], transfers: ActivityInterface[]) => {
  const result: ActivityGroup[] = [];

  const activities = operations.concat(transfers).sort((a, b) => b.timestamp - a.timestamp);
  let prevActivity: ActivityInterface = emptyActivity;

  for (const activity of activities) {
    if (activity.hash === prevActivity.hash) {
      result[result.length - 1].push(activity);
    } else {
      result.push([activity]);
    }

    prevActivity = activity;
  }

  return result;
};
export const accountPkh$ = new BehaviorSubject<string | undefined>(undefined);

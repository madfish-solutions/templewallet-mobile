import React, { useMemo } from 'react';

import { ActivityGroupsList } from '../../../components/activity-groups-list/activity-groups-list';
import { ActivityGroup } from '../../../interfaces/activity.interface';
import { useActivityGroupsSelector } from '../../../store/wallet/wallet-selectors';
import { isDefined } from '../../../utils/is-defined';

export const TezosTokenHistory = () => {
  const activityGroups = useActivityGroupsSelector();

  const filteredActivityGroups = useMemo(() => {
    const result: ActivityGroup[] = [];

    for (const activityGroup of activityGroups) {
      for (const activity of activityGroup) {
        if (!isDefined(activity.address)) {
          result.push(activityGroup);
          break;
        }
      }
    }

    return result;
  }, [activityGroups]);

  return <ActivityGroupsList activityGroups={filteredActivityGroups} />;
};

import React from 'react';

import { ActivityGroupsList } from '../../../components/activity-groups-list/activity-groups-list';
import { useTezosTokenActivity } from '../../../hooks/use-tezos-token-activity.hook';

export const TezosTokenHistory = () => {
  const { activities } = useTezosTokenActivity();
  // const activityGroups = useActivityGroupsSelector();

  // const filteredActivityGroups = useMemo(() => {
  //   const result: ActivityGroup[] = [];

  //   for (const activityGroup of activityGroups) {
  //     for (const activity of activityGroup) {
  //       if (!isDefined(activity.address)) {
  //         result.push(activityGroup);
  //         break;
  //       }
  //     }
  //   }

  //   return result;
  // }, [activityGroups]);

  return <ActivityGroupsList activityGroups={activities} />;
  // return <Text>Todo Tezos</Text>;
};

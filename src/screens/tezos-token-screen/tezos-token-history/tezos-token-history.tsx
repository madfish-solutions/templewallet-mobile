import React from 'react';

import { ActivityGroupsList } from '../../../components/activity-groups-list/activity-groups-list';
import { useTezosTokenActivity } from '../../../hooks/use-tezos-token-activity.hook';

export const TezosTokenHistory = () => {
  const { activities, handleUpdate } = useTezosTokenActivity();

  return <ActivityGroupsList loadMore={handleUpdate} activityGroups={activities} />;
};

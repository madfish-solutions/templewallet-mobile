import React, { FC } from 'react';

import { ActivityGroup } from '../../interfaces/activity.interface';
import { DataPlaceholder } from '../data-placeholder/data-placeholder';
import { ActivityGroupItem } from './activity-group-item/activity-group-item';

interface Props {
  activityGroups: ActivityGroup[];
}

export const ActivityGroupsList: FC<Props> = ({ activityGroups }) => {
  const isShowPlaceholder = activityGroups.length === 0;

  return isShowPlaceholder ? (
    <DataPlaceholder text="No Activity records where found" />
  ) : (
    activityGroups.map((group, index) => <ActivityGroupItem key={group[0]?.hash ?? index} group={group} />)
  );
};

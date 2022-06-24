import React from 'react';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
import { useGeneralActivity } from '../../hooks/use-general-activity';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

export const Activity = () => {
  const { activities, handleUpdate } = useGeneralActivity();

  usePageAnalytic(ScreensEnum.Activity);

  return <ActivityGroupsList loadMore={handleUpdate} activityGroups={activities} />;
};

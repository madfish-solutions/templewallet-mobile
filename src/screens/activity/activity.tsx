import React from 'react';

import { ActivityGroupsList } from 'src/components/activity-groups-list/activity-groups-list';
import { useContractActivity } from 'src/hooks/use-contract-activity';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

export const Activity = () => {
  const { activities, handleUpdate, isAllLoaded, isLoading } = useContractActivity();

  usePageAnalytic(ScreensEnum.Activity);

  return (
    <ActivityGroupsList
      handleUpdate={handleUpdate}
      activityGroups={activities}
      isAllLoaded={isAllLoaded}
      isLoading={isLoading}
      pageName="Activity"
    />
  );
};

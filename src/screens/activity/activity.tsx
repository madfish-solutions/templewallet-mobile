import React from 'react';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
import { useContractActivity } from '../../hooks/use-contract-activity';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

export const Activity = () => {
  const { activities, handleUpdate, isAllLoaded, isInitialLoading } = useContractActivity();

  usePageAnalytic(ScreensEnum.Activity);

  return (
    <ActivityGroupsList
      handleUpdate={handleUpdate}
      activityGroups={activities}
      isAllLoaded={isAllLoaded}
      isInitialLoading={isInitialLoading}
    />
  );
};

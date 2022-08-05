import React from 'react';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
import { useContractActivity } from '../../hooks/use-contract-activity';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { LoadLastActivityTokenType } from '../../utils/token-operations.util';

export const Activity = () => {
  const { activities, handleUpdate } = useContractActivity(LoadLastActivityTokenType.All, '', '');

  usePageAnalytic(ScreensEnum.Activity);

  return <ActivityGroupsList handleUpdate={handleUpdate} activityGroups={activities} />;
};

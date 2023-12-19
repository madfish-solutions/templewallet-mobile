import React from 'react';

import { ActivityGroupsList } from '../../../components/activity-groups-list/activity-groups-list';
import { useContractActivity } from '../../../hooks/use-contract-activity';
import { TEZ_TOKEN_SLUG } from '../../../token/data/tokens-metadata';

export const TezosTokenHistory = () => {
  const { activities, handleUpdate, isAllLoaded, isLoading } = useContractActivity(TEZ_TOKEN_SLUG);

  return (
    <ActivityGroupsList
      handleUpdate={handleUpdate}
      activityGroups={activities}
      isAllLoaded={isAllLoaded}
      isLoading={isLoading}
    />
  );
};

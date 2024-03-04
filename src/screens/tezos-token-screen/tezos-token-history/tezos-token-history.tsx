import React from 'react';

import { ActivityGroupsList } from 'src/components/activity-groups-list/activity-groups-list';
import { useContractActivity } from 'src/hooks/use-contract-activity';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';

export const TezosTokenHistory = () => {
  const { activities, handleUpdate, isAllLoaded, isLoading } = useContractActivity(TEZ_TOKEN_SLUG);

  return (
    <ActivityGroupsList
      handleUpdate={handleUpdate}
      activityGroups={activities}
      isAllLoaded={isAllLoaded}
      isLoading={isLoading}
      pageName="Token page"
    />
  );
};

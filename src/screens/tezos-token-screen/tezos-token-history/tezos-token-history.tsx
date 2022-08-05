import React from 'react';

import { ActivityGroupsList } from '../../../components/activity-groups-list/activity-groups-list';
import { useContractActivity } from '../../../hooks/use-contract-activity';
import { LoadLastActivityTokenType } from '../../../utils/token-operations.util';

export const TezosTokenHistory = () => {
  const { activities, handleUpdate } = useContractActivity(LoadLastActivityTokenType.Tezos, '', '');

  return <ActivityGroupsList handleUpdate={handleUpdate} activityGroups={activities} />;
};

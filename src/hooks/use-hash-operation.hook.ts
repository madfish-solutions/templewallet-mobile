import { useCallback, useEffect, useState } from 'react';

import { ActivityGroup, ActivityInterface } from '../interfaces/activity.interface';
import { OperationLiquidityBakingInterface } from '../interfaces/operation.interface';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { transformActivityInterfaceToActivityGroups } from '../utils/activity.utils';
import { mapOperationsToActivities } from '../utils/operation.utils';
import { getOperationGroupByHash } from '../utils/token-operations.util';

export const useHashOperation = (hash: string) => {
  const { publicKeyHash } = useSelectedAccountSelector();

  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadHashOperation = useCallback(async () => {
    const loadedActivities = await loadContractActivity(publicKeyHash, hash);

    const activityGroups = transformActivityInterfaceToActivityGroups(loadedActivities);
    setActivities(prevValue => [...prevValue, ...activityGroups]);
  }, [publicKeyHash, setActivities]);

  useEffect(() => {
    loadHashOperation();
  }, [loadHashOperation]);

  return activities;
};

const loadContractActivity = async (publicKeyHash: string, hash: string): Promise<Array<ActivityInterface>> => {
  const operations = await getOperationGroupByHash<OperationLiquidityBakingInterface>(hash).then(x => x.data);

  return mapOperationsToActivities(publicKeyHash, operations);
};

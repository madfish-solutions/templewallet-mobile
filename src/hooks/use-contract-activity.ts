import { useCallback, useEffect, useState } from 'react';

import { ActivityGroup, ActivityInterface } from '../interfaces/activity.interface';
import { OperationLiquidityBakingInterface } from '../interfaces/operation.interface';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { transformActivityInterfaceToActivityGroups } from '../utils/activity.utils';
import { isDefined } from '../utils/is-defined';
import { mapOperationLiquidityBakingToActivity } from '../utils/operation.utils';
import { getContractOperations } from '../utils/token-operations.util';

export const useContractActivity = (contractAddress: string): UseActivityInterface => {
  const { publicKeyHash } = useSelectedAccountSelector();

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadLastActivity = useCallback(
    async (lastLevel: number | null) => {
      const loadedActivities = await loadContractActivity(publicKeyHash, contractAddress, lastLevel);

      setIsAllLoaded(loadedActivities.length === 0);
      const activityGroups = transformActivityInterfaceToActivityGroups(loadedActivities);
      setActivities(prevValue => [...prevValue, ...activityGroups]);
    },
    [publicKeyHash, setActivities]
  );

  useEffect(() => {
    loadLastActivity(null);
  }, [loadLastActivity]);

  const handleUpdate = () => {
    if (isDefined(activities) && activities.length > 0 && !isAllLoaded) {
      const lastActivityGroup = activities[activities.length - 1];
      if (lastActivityGroup.length > 0) {
        loadLastActivity(lastActivityGroup[0].level ?? null);
      }
    }
  };

  return {
    handleUpdate,
    activities
  };
};

const loadContractActivity = async (
  publicKeyHash: string,
  contractAddress: string,
  lastLevel: number | null
): Promise<Array<ActivityInterface>> => {
  const operations = await getContractOperations<OperationLiquidityBakingInterface>(
    publicKeyHash,
    contractAddress,
    lastLevel
  ).then(x => x.data);

  return mapOperationLiquidityBakingToActivity(publicKeyHash, operations);
};

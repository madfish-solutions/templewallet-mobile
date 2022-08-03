import { useCallback, useEffect, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { OperationInterface, OperationLiquidityBakingInterface } from '../interfaces/operation.interface';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { transformActivityInterfaceToActivityGroups } from '../utils/activity.utils';
import { deduplicate } from '../utils/array.utils';
import { isDefined } from '../utils/is-defined';
import { mapOperationLiquidityBakingToActivity } from '../utils/operation.utils';
import { getContractOperations, getOperationGroupByHash } from '../utils/token-operations.util';

export const useContractActivity = (contractAddress: string): UseActivityInterface => {
  const { publicKeyHash } = useSelectedAccountSelector();

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadLastActivity = useCallback(
    async (lastLevel: number | null) => {
      const operations = await getContractOperations<OperationLiquidityBakingInterface>(
        publicKeyHash,
        contractAddress,
        lastLevel
      ).then(x => x.data);
      const filteredOperations = deduplicate<OperationInterface>(operations, (a, b) => a.hash === b.hash);

      setIsAllLoaded(filteredOperations.length === 0);

      const operationGroups = (
        await Promise.all(
          filteredOperations.map(x =>
            getOperationGroupByHash<OperationLiquidityBakingInterface>(x.hash).then(x => x.data)
          )
        )
      ).flat();

      const loadedActivities = mapOperationLiquidityBakingToActivity(publicKeyHash, operationGroups);

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

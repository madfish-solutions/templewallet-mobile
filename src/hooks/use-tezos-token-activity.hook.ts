import { uniqBy } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { OperationInterface, OperationLiquidityBakingInterface } from '../interfaces/operation.interface';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { isDefined } from '../utils/is-defined';
import { mapOperationsToActivities } from '../utils/operation.utils';
import { getOperationGroupByHash, getTezosOperations } from '../utils/token-operations.util';

export const useTezosTokenActivity = (): UseActivityInterface => {
  const { publicKeyHash } = useSelectedAccountSelector();

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadLastActivity = useCallback(
    async (lastId: number | null) => {
      const operations = await getTezosOperations(publicKeyHash, lastId);

      const filteredOperations = uniqBy<OperationInterface>(operations, 'hash');

      setIsAllLoaded(filteredOperations.length === 0);

      const operationGroups = await Promise.all(
        filteredOperations.map(x =>
          getOperationGroupByHash<OperationLiquidityBakingInterface>(x.hash).then(x => x.data)
        )
      );

      const activityGroups: Array<ActivityGroup> = [];
      for (const group of operationGroups) {
        activityGroups.push(mapOperationsToActivities(publicKeyHash, group));
      }

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
        loadLastActivity(lastActivityGroup[0].id ?? null);
      }
    }
  };

  return {
    handleUpdate,
    activities
  };
};

import { useCallback, useEffect, useState } from 'react';

import { OPERATION_LIMIT } from '../config/general';
import { ActivityGroup } from '../interfaces/activity.interface';
import { OperationFa12Interface, OperationFa2Interface, OperationInterface } from '../interfaces/operation.interface';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { transformActivityInterfaceToActivityGroups } from '../utils/activity.utils';
import { deduplicate } from '../utils/array.utils';
import { isDefined } from '../utils/is-defined';
import {
  mapOperationsFa12ToActivities,
  mapOperationsFa2ToActivities,
  mapOperationsToActivities
} from '../utils/operation.utils';
import {
  getFa12IncomingOperations,
  getFa2IncomingOperations,
  getOperationGroupByHash,
  getTokenOperations
} from '../utils/token-operations.util';

export const useGeneralActivity = (): UseActivityInterface => {
  const { publicKeyHash } = useSelectedAccountSelector();

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadOperations = useCallback(
    async (upperId: number | null) => {
      const operations = await getTokenOperations(publicKeyHash, upperId);
      if (operations.length === 0) {
        return;
      }
      const filteredOperations = deduplicate<OperationInterface>(operations, (a, b) => a.hash === b.hash);
      const operationGroups = (
        await Promise.all(
          filteredOperations.map(x => getOperationGroupByHash<OperationInterface>(x.hash).then(x => x.data))
        )
      ).flat();
      const localLastItem = operationGroups[operationGroups.length - 1];
      if (!isDefined(localLastItem)) {
        setIsAllLoaded(true);

        return;
      }
      const lowerId = localLastItem.id;
      const operationsFa12 = await getFa12IncomingOperations(publicKeyHash, lowerId, upperId);
      const operationsFa2 = await getFa2IncomingOperations(publicKeyHash, lowerId, upperId);

      const filteredOperationsFa12 = deduplicate<OperationInterface>(operationsFa12, (a, b) => a.hash === b.hash);
      const operationGroupsFa12 = (
        await Promise.all(
          filteredOperationsFa12.map(x => getOperationGroupByHash<OperationFa12Interface>(x.hash).then(x => x.data))
        )
      ).flat();
      const filteredOperationsFa2 = deduplicate<OperationInterface>(operationsFa2, (a, b) => a.hash === b.hash);
      const operationGroupsFa2 = (
        await Promise.all(
          filteredOperationsFa2.map(x => getOperationGroupByHash<OperationFa2Interface>(x.hash).then(x => x.data))
        )
      ).flat();

      if (operationGroups.length === 0 && operationsFa12.length === 0 && operationsFa2.length === 0) {
        setIsAllLoaded(true);

        return;
      }

      const loadedActivities = mapOperationsToActivities(publicKeyHash, operationGroups);
      const loadedActivitiesFa12 = mapOperationsFa12ToActivities(publicKeyHash, operationGroupsFa12);
      const loadedActivitiesFa2 = mapOperationsFa2ToActivities(publicKeyHash, operationGroupsFa2);

      const allOperations = [...loadedActivitiesFa12, ...loadedActivitiesFa2, ...loadedActivities].sort(
        (b, a) => a.level ?? 0 - (b.level ?? 0)
      );
      const activityGroups = transformActivityInterfaceToActivityGroups(allOperations);

      setActivities(prevValue => [...prevValue, ...activityGroups]);
    },
    [publicKeyHash, setActivities]
  );

  useEffect(() => {
    loadOperations(null);
  }, [loadOperations]);

  const handleUpdate = () => {
    if (isDefined(activities) && activities.length > 0 && !isAllLoaded && activities.length >= OPERATION_LIMIT) {
      const lastActivityGroup = activities[activities.length - 1];
      if (lastActivityGroup.length > 0) {
        loadOperations(lastActivityGroup[0].id ?? null);
      }
    }
  };

  return {
    handleUpdate,
    activities
  };
};

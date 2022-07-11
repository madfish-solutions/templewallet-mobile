import { useCallback, useEffect, useState } from 'react';

import { OPERATION_LIMIT } from '../config/general';
import { ActivityGroup } from '../interfaces/activity.interface';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { transformActivityInterfaceToActivityGroups } from '../utils/activity.utils';
import { isDefined } from '../utils/is-defined';
import {
  mapOperationsFa12ToActivities,
  mapOperationsFa2ToActivities,
  mapOperationsToActivities
} from '../utils/operation.utils';
import {
  getFa12IncomingOperations,
  getFa2IncomingOperations,
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
      const localLastItem = operations[operations.length - 1];
      if (!isDefined(localLastItem)) {
        setIsAllLoaded(true);

        return;
      }
      const lowerId = localLastItem.id;
      const operationsFa12 = await getFa12IncomingOperations(publicKeyHash, lowerId, upperId);
      const operationsFa2 = await getFa2IncomingOperations(publicKeyHash, lowerId, upperId);

      if (operations.length === 0 && operationsFa12.length === 0 && operationsFa2.length === 0) {
        setIsAllLoaded(true);

        return;
      }

      const loadedActivities = mapOperationsToActivities(publicKeyHash, operations);
      const loadedActivitiesFa12 = mapOperationsFa12ToActivities(publicKeyHash, operationsFa12);
      const loadedActivitiesFa2 = mapOperationsFa2ToActivities(publicKeyHash, operationsFa2);

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

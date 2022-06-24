import { useCallback, useEffect, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
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

export const useGeneralActivity = () => {
  const { publicKeyHash } = useSelectedAccountSelector();

  const [lastId, setLastId] = useState<null | number>(null);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadPrimaryOperations = useCallback(async () => {
    const outcomingOperations = await getTokenOperations(publicKeyHash, lastId);
    if (outcomingOperations.data.length < 0) {
      return;
    }
    const localLastId = outcomingOperations.data[outcomingOperations.data.length - 1].id;
    const incomingOperationsFa12 = await getFa12IncomingOperations(publicKeyHash, localLastId, lastId);
    const incomingOperationsFa2 = await getFa2IncomingOperations(publicKeyHash, localLastId, lastId);
    const { data: operations } = outcomingOperations;
    const { data: operationsFa12 } = incomingOperationsFa12;
    const { data: operationsFa2 } = incomingOperationsFa2;

    const loadedActivities = mapOperationsToActivities(publicKeyHash, operations);
    const loadedActivitiesFa12 = mapOperationsFa12ToActivities(publicKeyHash, operationsFa12);
    const loadedActivitiesFa2 = mapOperationsFa2ToActivities(publicKeyHash, operationsFa2);

    const allOperations = [...loadedActivitiesFa12, ...loadedActivitiesFa2, ...loadedActivities].sort(
      (b, a) => a.level ?? 0 - (b.level ?? 0)
    );
    const activityGroups = transformActivityInterfaceToActivityGroups(allOperations);

    setActivities(prevValue => [...prevValue, ...activityGroups]);
  }, [publicKeyHash, setActivities, setLastId]);

  useEffect(() => {
    loadPrimaryOperations();
  }, [loadPrimaryOperations]);

  const handleUpdate = () => {
    if (isDefined(activities) && activities.length > 0) {
      const lastActivityGroup = activities[activities.length - 1];
      if (lastActivityGroup.length > 0) {
        setLastId(lastActivityGroup[0].level ?? null);
      }
    }
  };

  return {
    handleUpdate,
    activities
  };
};

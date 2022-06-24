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

  const [lastId, setLastId] = useState<null | number>(null);
  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadPrimaryOperations = useCallback(async () => {
    const outcomingOperations = await getTokenOperations(publicKeyHash, lastId);
    if (outcomingOperations.data.length < 0) {
      return;
    }
    const localLastItem = outcomingOperations.data[outcomingOperations.data.length - 1];
    console.log('use-general-activity outcomingOperations.data', outcomingOperations.data.length, lastId);
    if (!isDefined(localLastItem)) {
      console.log(localLastItem);
      setIsAllLoaded(true);

      return;
    }
    const localLastId = localLastItem.id;
    const incomingOperationsFa12 = await getFa12IncomingOperations(publicKeyHash, localLastId, lastId);
    const incomingOperationsFa2 = await getFa2IncomingOperations(publicKeyHash, localLastId, lastId);
    const { data: operations } = outcomingOperations;
    const { data: operationsFa12 } = incomingOperationsFa12;
    const { data: operationsFa2 } = incomingOperationsFa2;

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
  }, [publicKeyHash, setActivities, lastId]);

  useEffect(() => {
    loadPrimaryOperations();
  }, [loadPrimaryOperations]);

  const handleUpdate = () => {
    if (isDefined(activities) && activities.length > 0 && !isAllLoaded && activities.length >= OPERATION_LIMIT) {
      const lastActivityGroup = activities[activities.length - 1];
      if (lastActivityGroup.length > 0) {
        setLastId(lastActivityGroup[0].id ?? null);
      }
    }
  };

  return {
    handleUpdate,
    activities,
    isAllLoaded
  };
};

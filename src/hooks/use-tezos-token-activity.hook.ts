import { useCallback, useEffect, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { transformActivityInterfaceToActivityGroups } from '../utils/activity.utils';
import { isDefined } from '../utils/is-defined';
import { mapOperationsToActivities } from '../utils/operation.utils';
import { getTezosOperations } from '../utils/token-operations.util';

export const useTezosTokenActivity = (): UseActivityInterface => {
  const { publicKeyHash } = useSelectedAccountSelector();

  const [lastId, setLastId] = useState<null | number>(null);
  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadLastActivity = useCallback(async () => {
    const result = await getTezosOperations(publicKeyHash, lastId);
    const { data: operations } = result;

    setIsAllLoaded(operations.length === 0);

    const loadedActivities = mapOperationsToActivities(publicKeyHash, operations);
    const activityGroups = transformActivityInterfaceToActivityGroups(loadedActivities);

    setActivities(prevValue => [...prevValue, ...activityGroups]);
  }, [publicKeyHash, setActivities, lastId]);

  useEffect(() => {
    loadLastActivity();
  }, [loadLastActivity]);

  const handleUpdate = () => {
    if (isDefined(activities) && activities.length > 0 && !isAllLoaded) {
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

import { useCallback, useEffect, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { transformActivityInterfaceToActivityGroups } from '../utils/activity.utils';
import { isDefined } from '../utils/is-defined';
import { mapOperationsToActivities } from '../utils/operation.utils';
import { getTezosOperations } from '../utils/token-operations.util';

export const useTezosTokenActivity = () => {
  const { publicKeyHash } = useSelectedAccountSelector();

  const [lastLevel, setLastLevel] = useState<null | number>(null);
  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadLastActivity = useCallback(async () => {
    const result = await getTezosOperations(publicKeyHash, lastLevel);
    const { data: operations } = result;

    setIsAllLoaded(operations.length === 0);

    const loadedActivities = mapOperationsToActivities(publicKeyHash, operations);
    const activityGroups = transformActivityInterfaceToActivityGroups(loadedActivities);

    setActivities(prevValue => [...prevValue, ...activityGroups]);
  }, [publicKeyHash, setActivities, lastLevel]);

  useEffect(() => {
    loadLastActivity();
  }, [loadLastActivity]);

  const handleUpdate = () => {
    if (isDefined(activities) && activities.length > 0) {
      const lastActivityGroup = activities[activities.length - 1];
      if (lastActivityGroup.length > 0) {
        setLastLevel(lastActivityGroup[0].level ?? null);
      }
    }
  };

  return {
    handleUpdate,
    activities,
    isAllLoaded
  };
};

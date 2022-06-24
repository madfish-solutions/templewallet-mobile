import { useCallback, useEffect, useState } from 'react';

import { ActivityGroup, ActivityInterface } from '../interfaces/activity.interface';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { transformActivityInterfaceToActivityGroups } from '../utils/activity.utils';
import { isDefined } from '../utils/is-defined';
import { mapOperationsFa12ToActivities, mapOperationsFa2ToActivities } from '../utils/operation.utils';
import { getTokenFa12Operations, getTokenFa2Operations } from '../utils/token-operations.util';

export const useTokenActivity = (contractAddress: string, tokenId?: string) => {
  const { publicKeyHash } = useSelectedAccountSelector();

  const [lastLevel, setLastLevel] = useState<null | number>(null);
  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadLastActivity = useCallback(async () => {
    const loadedActivities = isDefined(tokenId)
      ? await loadFa2Activity(publicKeyHash, contractAddress, tokenId, lastLevel)
      : await loadFa12Activity(publicKeyHash, contractAddress, lastLevel);

    setIsAllLoaded(loadedActivities.length === 0);
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

const loadFa2Activity = async (
  publicKeyHash: string,
  contractAddress: string,
  tokenId: string,
  lastLevel: number | null
): Promise<Array<ActivityInterface>> => {
  const result = await getTokenFa2Operations(publicKeyHash, contractAddress, tokenId, lastLevel);
  const { data: operations } = result;

  return mapOperationsFa2ToActivities(publicKeyHash, operations);
};

const loadFa12Activity = async (
  publicKeyHash: string,
  contractAddress: string,
  lastLevel: number | null
): Promise<Array<ActivityInterface>> => {
  const result = await getTokenFa12Operations(publicKeyHash, contractAddress, lastLevel);
  const { data: operations } = result;

  return mapOperationsFa12ToActivities(publicKeyHash, operations);
};

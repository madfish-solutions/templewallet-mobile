import { useCallback, useEffect, useState } from 'react';

import { ActivityGroup, ActivityInterface } from '../interfaces/activity.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { transformActivityInterfaceToActivityGroups } from '../utils/activity.utils';
import { isDefined } from '../utils/is-defined';
import { mapOperationsFa12ToActivities, mapOperationsFa2ToActivities } from '../utils/operation.utils';
import { getTokenFa12Operations, getTokenFa2Operations } from '../utils/token-operations.util';
import { useTokenType } from './use-token-type';

export const useTokenActivity = (contractAddress: string, tokenId: string): UseActivityInterface => {
  const { tokenType, loading } = useTokenType(contractAddress);
  const { publicKeyHash } = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadLastActivity = useCallback(
    async (lastLevel: number | null) => {
      if (loading) {
        return;
      }

      const loadedActivities =
        tokenType === TokenTypeEnum.FA_2
          ? await loadFa2Activity(selectedRpcUrl, publicKeyHash, contractAddress, tokenId, lastLevel)
          : await loadFa12Activity(selectedRpcUrl, publicKeyHash, contractAddress, lastLevel);

      setIsAllLoaded(loadedActivities.length === 0);
      const activityGroups = transformActivityInterfaceToActivityGroups(loadedActivities);
      setActivities(prevValue => [...prevValue, ...activityGroups]);
    },
    [publicKeyHash, setActivities, loading, tokenType]
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

const loadFa2Activity = async (
  selectedRpcUrl: string,
  publicKeyHash: string,
  contractAddress: string,
  tokenId: string,
  lastLevel: number | null
): Promise<Array<ActivityInterface>> => {
  const operations = await getTokenFa2Operations(selectedRpcUrl, publicKeyHash, contractAddress, tokenId, lastLevel);

  return mapOperationsFa2ToActivities(publicKeyHash, operations);
};

const loadFa12Activity = async (
  selectedRpcUrl: string,
  publicKeyHash: string,
  contractAddress: string,
  lastLevel: number | null
): Promise<Array<ActivityInterface>> => {
  const operations = await getTokenFa12Operations(selectedRpcUrl, publicKeyHash, contractAddress, lastLevel);

  return mapOperationsFa12ToActivities(publicKeyHash, operations);
};

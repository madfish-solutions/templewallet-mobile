import { useCallback, useEffect, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { OperationFa12Interface, OperationFa2Interface, OperationInterface } from '../interfaces/operation.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { transformActivityInterfaceToActivityGroups } from '../utils/activity.utils';
import { deduplicate } from '../utils/array.utils';
import { isDefined } from '../utils/is-defined';
import { mapOperationsFa12ToActivities, mapOperationsFa2ToActivities } from '../utils/operation.utils';
import { getOperationGroupByHash, getTokenFa12Operations, getTokenFa2Operations } from '../utils/token-operations.util';
import { useTokenType } from './use-token-type';

export const useTokenActivity = (contractAddress: string, tokenId: string): UseActivityInterface => {
  const { tokenType, loading } = useTokenType(contractAddress);
  const { publicKeyHash } = useSelectedAccountSelector();

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const loadLastActivity = useCallback(
    async (lastLevel: number | null) => {
      if (loading) {
        return;
      }

      const operations =
        tokenType === TokenTypeEnum.FA_2
          ? await loadFa2Activity(publicKeyHash, contractAddress, tokenId, lastLevel)
          : await loadFa12Activity(publicKeyHash, contractAddress, lastLevel);

      const filteredOperations = deduplicate<OperationInterface>(operations, (a, b) => a.hash === b.hash);

      setIsAllLoaded(filteredOperations.length === 0);

      const operationGroups = (
        await Promise.all(
          filteredOperations.map(x => getOperationGroupByHash<OperationInterface>(x.hash).then(x => x.data))
        )
      ).flat();

      const loadedActivities =
        tokenType === TokenTypeEnum.FA_2
          ? await mapOperationsFa2ToActivities(publicKeyHash, operationGroups as Array<OperationFa2Interface>)
          : await mapOperationsFa12ToActivities(publicKeyHash, operationGroups as Array<OperationFa12Interface>);

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
  publicKeyHash: string,
  contractAddress: string,
  tokenId: string,
  lastLevel: number | null
) => await getTokenFa2Operations(publicKeyHash, contractAddress, tokenId, lastLevel);

const loadFa12Activity = async (publicKeyHash: string, contractAddress: string, lastLevel: number | null) =>
  await getTokenFa12Operations(publicKeyHash, contractAddress, lastLevel);

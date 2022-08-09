import { useEffect, useState } from 'react';

import { emptyFn } from '../config/general';
import { ActivityGroup } from '../interfaces/activity.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { isDefined } from '../utils/is-defined';
import { loadLastActivity, LoadLastActivityTokenType, LoadLastActivityType } from '../utils/token-operations.util';

export const useContractActivity = (
  tokenType: LoadLastActivityType,
  contractAddress: string,
  tokenId: string,
  loading = false
): UseActivityInterface => {
  const { publicKeyHash } = useSelectedAccountSelector();
  const selectedRpc = useSelectedRpcUrlSelector();

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  useEffect(() => {
    if (!loading) {
      loadLastActivity({
        selectedRpc,
        lastLevel: null,
        publicKeyHash,
        contractAddress,
        tokenId,
        tokenType,
        setActivities,
        setIsAllLoaded
      });
    }

    return emptyFn;
  }, [loading, tokenType]);

  const handleUpdate = () => {
    if (isDefined(activities) && activities.length > 0 && !isAllLoaded) {
      const lastActivityGroup = activities[activities.length - 1];
      if (lastActivityGroup.length > 0) {
        const lastActivityItem = lastActivityGroup[lastActivityGroup.length - 1];
        const lastLevelOrLastId =
          tokenType === TokenTypeEnum.FA_1_2 ||
          tokenType === TokenTypeEnum.FA_2 ||
          tokenType === LoadLastActivityTokenType.LiquidityBaking
            ? lastActivityItem.level
            : lastActivityItem.id;
        if (isDefined(lastLevelOrLastId)) {
          loadLastActivity({
            selectedRpc,
            lastLevel: lastLevelOrLastId,
            publicKeyHash,
            contractAddress,
            tokenId,
            tokenType,
            setActivities,
            setIsAllLoaded
          });
        }
      }
    }
  };

  return {
    handleUpdate,
    activities
  };
};

import { useEffect, useMemo, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { LIQUIDITY_BAKING_DEX_ADDRESS } from '../token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { isDefined } from '../utils/is-defined';
import { loadLastActivity, LoadLastActivityTokenType } from '../utils/token-operations.util';
import { useTokenType } from './use-token-type';

export const useContractActivity = (tokenSlug?: string): UseActivityInterface => {
  const [contractAddress, tokenId] = (tokenSlug ?? '').split('_');
  const { tokenType, loading } = useTokenType(contractAddress);
  const { publicKeyHash } = useSelectedAccountSelector();
  const selectedRpc = useSelectedRpcUrlSelector();

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const activityType = useMemo(() => {
    if (isDefined(tokenSlug)) {
      switch (tokenSlug) {
        case TEZ_TOKEN_SLUG:
          return LoadLastActivityTokenType.Tezos;
        case LIQUIDITY_BAKING_DEX_ADDRESS:
          return LoadLastActivityTokenType.LiquidityBaking;
        default:
          return tokenType;
      }
    } else {
      return LoadLastActivityTokenType.All;
    }
  }, [tokenType]);

  useEffect(() => {
    if (!loading) {
      loadLastActivity({
        selectedRpc,
        lastLevel: null,
        publicKeyHash,
        contractAddress,
        tokenId: tokenId ?? '0',
        activityType,
        setActivities,
        setIsAllLoaded
      });
    }
  }, [loading, activityType]);

  const handleUpdate = () => {
    if (isDefined(activities) && activities.length > 0 && !isAllLoaded) {
      const lastActivityGroup = activities[activities.length - 1];
      if (lastActivityGroup.length > 0) {
        const lastActivityItem = lastActivityGroup[lastActivityGroup.length - 1];
        const lastLevelOrLastId =
          activityType === TokenTypeEnum.FA_1_2 ||
          activityType === TokenTypeEnum.FA_2 ||
          activityType === LoadLastActivityTokenType.LiquidityBaking
            ? lastActivityItem.level
            : lastActivityItem.id;
        if (isDefined(lastLevelOrLastId)) {
          loadLastActivity({
            selectedRpc,
            lastLevel: lastLevelOrLastId,
            publicKeyHash,
            contractAddress,
            tokenId: tokenId ?? '0',
            activityType,
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

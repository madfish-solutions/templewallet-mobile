import { useEffect, useRef, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { isDefined } from '../utils/is-defined';
import { loadLastActivity } from '../utils/token-operations.util';
import { useTokenType } from './use-token-type';

export const useContractActivity = (tokenSlug?: string): UseActivityInterface => {
  const [contractAddress] = (tokenSlug ?? '').split('_');
  const { tokenType, loading } = useTokenType(contractAddress);
  const { publicKeyHash } = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const lastActivityRef = useRef<string>('');

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  useEffect(() => {
    const asyncFunction = async () => {
      const result = await loadLastActivity({
        selectedRpcUrl,
        lastItem: null,
        publicKeyHash,
        tokenSlug,
        tokenType
      });
      if (result.length === 0) {
        setIsAllLoaded(true);
      }
      setActivities(result);
    };

    if (!loading) {
      asyncFunction();
    }
  }, [loading, tokenType]);

  const handleUpdate = async () => {
    if (isDefined(activities) && activities.length > 0 && !isAllLoaded) {
      const lastActivityGroup = activities[activities.length - 1].sort((a, b) => b.id - a.id);
      if (lastActivityGroup.length > 0) {
        const lastItem = lastActivityGroup[lastActivityGroup.length - 1];
        if (lastItem.hash !== lastActivityRef.current) {
          lastActivityRef.current = lastItem.hash;
          if (isDefined(lastItem)) {
            const result = await loadLastActivity({
              selectedRpcUrl,
              lastItem,
              publicKeyHash,
              tokenSlug,
              tokenType
            });
            if (result.length === 0) {
              setIsAllLoaded(true);
            }
            setActivities(prev => [...prev, ...result]);
          }
        }
      }
    }
  };

  return {
    handleUpdate,
    activities
  };
};

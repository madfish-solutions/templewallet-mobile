import { useEffect, useRef, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { isDefined } from '../utils/is-defined';
import { loadActivity } from '../utils/token-operations.util';

export const useContractActivity = (tokenSlug?: string): UseActivityInterface => {
  const selectedAccount = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const lastActivityRef = useRef<string>('');

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);
  const [hashes, setHashes] = useState<Array<string>>([]);

  useEffect(() => {
    const asyncFunction = async () => {
      const { operationsHashes, activities } = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug);

      if (activities.length === 0) {
        setIsAllLoaded(true);
      }
      setHashes(operationsHashes);
      setActivities(activities);
    };

    asyncFunction();
  }, [selectedRpcUrl, selectedAccount, tokenSlug]);

  const handleUpdate = async () => {
    if (activities.length > 0 && !isAllLoaded) {
      const lastActivityGroup = activities[activities.length - 1].sort((a, b) => b.id - a.id);

      if (lastActivityGroup.length > 0) {
        const lastItem = lastActivityGroup[lastActivityGroup.length - 1];

        if (lastItem.hash !== lastActivityRef.current) {
          lastActivityRef.current = lastItem.hash;

          if (isDefined(lastItem)) {
            const { operationsHashes, activities: newActivity } = await loadActivity(
              selectedRpcUrl,
              selectedAccount,
              tokenSlug,
              lastItem,
              hashes
            );

            if (newActivity.length === 0) {
              setIsAllLoaded(true);
            }
            setHashes(prev => [...prev, ...operationsHashes]);
            setActivities(prev => [...prev, ...newActivity]);
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

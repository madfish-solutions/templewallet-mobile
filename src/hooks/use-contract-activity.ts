import { uniq } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(false);
  const [isAdditionalLoading, setIsAdditionalLoading] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const initialLoad = useCallback(
    async (refresh = false) => {
      try {
        setIsInitialLoading(true);
        const activities = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug);

        if (activities.length === 0) {
          setIsAllLoaded(true);
        }
        if (refresh === true) {
          setActivities(prev => {
            const allActivities = [...activities, ...prev];
            const allHashes = allActivities.map(x => x[0]).map(x => x.hash);
            const onlyUniqueHashes = uniq(allHashes);
            const onlyUniqueActivitites = onlyUniqueHashes
              .map(x => allActivities.find(y => y[0].hash === x))
              .filter(isDefined);

            return onlyUniqueActivitites;
          });
        } else {
          setActivities(activities);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitialLoading(false);
      }
    },
    [selectedRpcUrl, selectedAccount, tokenSlug]
  );

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  const handleRefresh = () => {
    initialLoad(true);
  };

  const handleUpdate = async () => {
    try {
      if (activities.length > 0 && !isAllLoaded) {
        const lastActivityGroup = activities[activities.length - 1].sort((a, b) => b.id - a.id);

        if (lastActivityGroup.length > 0) {
          const lastItem = lastActivityGroup[lastActivityGroup.length - 1];

          if (lastItem.hash !== lastActivityRef.current) {
            lastActivityRef.current = lastItem.hash;

            if (isDefined(lastItem) && !isAdditionalLoading) {
              setIsAdditionalLoading(true);

              const newActivity = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, lastItem);

              if (newActivity.length === 0) {
                setIsAllLoaded(true);
              }
              setActivities(prev => [...prev, ...newActivity]);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdditionalLoading(false);
    }
  };

  useEffect(() => {
    if (activities.length < 10) {
      handleUpdate();
    }
  }, [activities]);

  return {
    handleUpdate,
    handleRefresh,
    activities,
    isAllLoaded,
    isInitialLoading
  };
};

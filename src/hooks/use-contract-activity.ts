import { uniq } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { useAnalytics } from '../utils/analytics/use-analytics.hook';
import { isDefined } from '../utils/is-defined';
import { loadActivity } from '../utils/token-operations.util';

interface ContractActivityState {
  activities: Array<ActivityGroup>;
  isAllLoaded: boolean;
  isLoading: boolean;
}

export const useContractActivity = (tokenSlug?: string): UseActivityInterface => {
  const selectedAccount = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const { trackErrorEvent } = useAnalytics();

  const lastActivityRef = useRef<string>('');

  const [{ isAllLoaded, isLoading, activities }, setState] = useState<ContractActivityState>({
    activities: [],
    isAllLoaded: false,
    isLoading: true
  });

  const initialLoad = useCallback(
    async (refresh = false) => {
      let fetchedActivities: Array<ActivityGroup> = [];
      let isError = false;
      try {
        fetchedActivities = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug);
      } catch (error) {
        console.error(error);
        trackErrorEvent('InitialLoadContractActivityError', error, [selectedAccount.publicKeyHash], {
          tokenSlug,
          selectedRpcUrl,
          refresh
        });
        isError = true;
      } finally {
        setState(prevState => {
          const isAllLoaded = fetchedActivities.length === 0;
          let newActivities = fetchedActivities;
          if (isError) {
            newActivities = prevState.activities;
          } else if (refresh === true && !isAllLoaded) {
            const allActivities = [...fetchedActivities, ...prevState.activities];
            const allHashes = allActivities.map(x => x[0]).map(x => x.hash);
            const onlyUniqueHashes = uniq(allHashes);
            newActivities = onlyUniqueHashes.map(x => allActivities.find(y => y[0].hash === x)).filter(isDefined);
          }

          return {
            isAllLoaded,
            activities: newActivities,
            isLoading: false
          };
        });
      }
    },
    [selectedRpcUrl, selectedAccount, tokenSlug, trackErrorEvent]
  );

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  const handleRefresh = () => {
    initialLoad(true);
  };

  const handleUpdate = async () => {
    let newActivities: Array<ActivityGroup> = [];
    const wasLoading = isLoading;
    const lastItem = activities
      .at(-1)
      ?.sort((a, b) => b.id - a.id)
      .at(-1);
    try {
      if (lastItem && lastItem.hash !== lastActivityRef.current && !isAllLoaded) {
        lastActivityRef.current = lastItem.hash;

        if (!isLoading) {
          setState(prev => ({ ...prev, isLoading: true }));

          newActivities = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, lastItem);
        }
      }
    } catch (error) {
      console.error(error);
      trackErrorEvent('HandleUpdateContractActivityError', error, [selectedAccount.publicKeyHash], {
        tokenSlug,
        selectedRpcUrl,
        lastItem
      });
    } finally {
      if (wasLoading) {
        return;
      }

      const isAllLoaded = newActivities.length === 0 && !wasLoading;

      setState(prevState => ({
        activities: isAllLoaded ? prevState.activities : [...prevState.activities, ...newActivities],
        isAllLoaded,
        isLoading: false
      }));
    }
  };

  useEffect(() => {
    if (activities.length < 10 && !isLoading) {
      handleUpdate();
    }
  }, [activities, isLoading]);

  return {
    handleUpdate,
    handleRefresh,
    activities,
    isAllLoaded,
    isLoading
  };
};

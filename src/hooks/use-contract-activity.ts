import { uniq } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ActivityGroup } from 'src/interfaces/activity.interface';
import { UseActivityInterface } from 'src/interfaces/use-activity.interface';
import { useAccount } from 'src/store/wallet/wallet-selectors';
import { getAccountAddressForTezos } from 'src/utils/account.utils';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { loadActivity } from 'src/utils/token-operations.util';

interface ContractActivityState {
  activities: Array<ActivityGroup>;
  isAllLoaded: boolean;
  isLoading: boolean;
}

export const useContractActivity = (tokenSlug?: string): UseActivityInterface => {
  const selectedAccount = useAccount();
  const { trackErrorEvent } = useAnalytics();
  const selectedTezosAddress = getAccountAddressForTezos(selectedAccount);

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
        fetchedActivities = await loadActivity(selectedAccount, tokenSlug);
      } catch (error) {
        console.error(error);
        trackErrorEvent('InitialLoadContractActivityError', error, selectedTezosAddress ? [selectedTezosAddress] : [], {
          tokenSlug,
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
    [selectedAccount, selectedTezosAddress, tokenSlug, trackErrorEvent]
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

          newActivities = await loadActivity(selectedAccount, tokenSlug, lastItem);
        }
      }
    } catch (error) {
      console.error(error);
      trackErrorEvent('HandleUpdateContractActivityError', error, selectedTezosAddress ? [selectedTezosAddress] : [], {
        tokenSlug,
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

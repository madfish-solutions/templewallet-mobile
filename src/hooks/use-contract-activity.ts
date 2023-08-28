import { TzktMemberInterface, TzktOperation } from '@temple-wallet/transactions-parser';
import { uniq } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { KNOWN_BAKERS } from 'src/apis/baking-bad/consts';
import { ActivityGroup } from 'src/interfaces/activity.interface';
import { loadBakersListActions } from 'src/store/baking/baking-actions';
import { useBakersListSelector } from 'src/store/baking/baking-selectors';

import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { isDefined } from '../utils/is-defined';
import { loadActivity } from '../utils/token-operations.util';

const OLDEST_ACTIVITY_INDEX = 0;

const getUniqActivities = (activityGroups: Array<ActivityGroup>) => {
  const allHashes = activityGroups.map(x => x[OLDEST_ACTIVITY_INDEX]).map(x => x.hash);
  const onlyUniqueHashes = uniq(allHashes);
  const onlyUniqueActivitites = onlyUniqueHashes
    .map(x => activityGroups.find(y => y[OLDEST_ACTIVITY_INDEX].hash === x))
    .filter(isDefined);

  return onlyUniqueActivitites;
};

export const useContractActivity = (tokenSlug?: string): UseActivityInterface => {
  const dispatch = useDispatch();
  const selectedAccount = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const bakers = useBakersListSelector();

  const lastOperationRef = useRef<TzktOperation>();

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const knownBakers = useMemo<Array<TzktMemberInterface>>(
    () => [
      ...KNOWN_BAKERS.map(({ address, name }) => ({
        address,
        alias: name
      })),
      ...bakers.map(({ address, name }) => ({
        address,
        alias: name
      }))
    ],
    [bakers]
  );

  const initialLoad = useCallback(
    async (refresh = false) => {
      const {
        activities: newActivity,
        reachedTheEnd,
        oldestOperation
      } = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, knownBakers, lastOperationRef.current);

      lastOperationRef.current = oldestOperation;

      if (reachedTheEnd) {
        setIsAllLoaded(true);
      }
      if (refresh === true) {
        setActivities(prev => getUniqActivities([...prev, ...newActivity]));
      } else {
        setActivities(newActivity);
      }
    },
    [selectedRpcUrl, selectedAccount, tokenSlug, knownBakers]
  );

  useEffect(() => void dispatch(loadBakersListActions.submit()), []);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  const handleRefresh = () => {
    initialLoad(true);
  };

  const handleUpdate = useCallback(async () => {
    try {
      if (!isAllLoaded && !isLoading) {
        setIsLoading(true);

        const {
          activities: newActivity,
          reachedTheEnd,
          oldestOperation
        } = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, knownBakers, lastOperationRef.current);

        lastOperationRef.current = oldestOperation;

        setActivities(prev => getUniqActivities([...prev, ...newActivity]));

        if (reachedTheEnd) {
          setIsAllLoaded(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRpcUrl, selectedAccount, tokenSlug, knownBakers, isLoading]);

  return {
    handleUpdate,
    handleRefresh,
    activities
  };
};

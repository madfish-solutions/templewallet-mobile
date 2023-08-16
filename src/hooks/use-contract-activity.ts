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

export const useContractActivity = (tokenSlug?: string): UseActivityInterface => {
  const dispatch = useDispatch();
  const selectedAccount = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const bakers = useBakersListSelector();

  const lastOperationRef = useRef<TzktOperation>();

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
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
      const { activities, reachedTheEnd, oldestOperation } = await loadActivity(
        selectedRpcUrl,
        selectedAccount,
        tokenSlug,
        knownBakers
      );

      lastOperationRef.current = oldestOperation ?? lastOperationRef.current;

      if (reachedTheEnd) {
        setIsAllLoaded(true);
      }
      if (refresh === true) {
        setActivities(prev => {
          const allActivities = [...activities, ...prev];
          const allHashes = allActivities.map(x => x[OLDEST_ACTIVITY_INDEX]).map(x => x.hash);
          const onlyUniqueHashes = uniq(allHashes);
          const onlyUniqueActivitites = onlyUniqueHashes
            .map(x => allActivities.find(y => y[OLDEST_ACTIVITY_INDEX].hash === x))
            .filter(isDefined);

          return onlyUniqueActivitites;
        });
      } else {
        setActivities(activities);
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

  const handleUpdate = async () => {
    if (activities.length > 0 && !isAllLoaded) {
      const {
        activities: newActivity,
        reachedTheEnd,
        oldestOperation
      } = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, knownBakers, lastOperationRef.current);

      lastOperationRef.current = oldestOperation ?? lastOperationRef.current;

      if (reachedTheEnd) {
        setIsAllLoaded(true);
      }
      setActivities(prev => [...prev, ...newActivity]);
    }
  };

  return {
    handleUpdate,
    handleRefresh,
    activities
  };
};

import { Activity, TzktMemberInterface, TzktOperation } from '@temple-wallet/transactions-parser';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { KNOWN_BAKERS } from 'src/apis/baking-bad/consts';
import { ActivityGroup } from 'src/interfaces/activity.interface';
import { loadBakersListActions } from 'src/store/baking/baking-actions';
import { useBakersListSelector } from 'src/store/baking/baking-selectors';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { loadActivity } from 'src/utils/token-operations.utils';

export const useContractActivity = (tokenSlug?: string) => {
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

  const load = useCallback(
    async (isInitialLoad: boolean) => {
      const allNewActivities: Activity[][] = [];

      // Loading 10+ items first (initially) & 3+ for the following calls
      const minGroupsCount = isInitialLoad ? 10 : 3;

      let newActivities: Activity[][];
      let newReachedTheEnd = false;
      let newOldestOperation: TzktOperation | undefined;

      while (allNewActivities.length < minGroupsCount) {
        if (newReachedTheEnd) {
          break;
        }

        try {
          setIsLoading(true);

          ({
            activities: newActivities,
            reachedTheEnd: newReachedTheEnd,
            oldestOperation: newOldestOperation
          } = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, knownBakers, lastOperationRef.current));

          lastOperationRef.current = newOldestOperation ?? lastOperationRef.current;

          allNewActivities.push(...newActivities);
        } catch (error) {
          console.error(error);
        }
      }

      setActivities(activities.concat(allNewActivities));
      setIsLoading(false);
      setIsAllLoaded(newReachedTheEnd);
    },
    [activities, selectedRpcUrl, selectedAccount, tokenSlug, knownBakers]
  );

  const handleUpdate = useCallback(async () => {
    if (isAllLoaded || isLoading) {
      return;
    }

    await load(false);
  }, [isAllLoaded, isLoading, load]);

  useEffect(() => void dispatch(loadBakersListActions.submit()), []);

  useEffect(() => void load(true), [load]);

  return {
    handleUpdate,
    activities
  };
};

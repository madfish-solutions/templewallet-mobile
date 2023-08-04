import { TzktMemberInterface } from '@temple-wallet/transactions-parser';
import { uniq } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { EVERSTAKE_PAYOUTS_BAKER } from 'src/apis/baking-bad/consts';
import { ActivityGroup } from 'src/interfaces/activity.interface';
import { loadBakersListActions } from 'src/store/baking/baking-actions';
import { useBakersListSelector } from 'src/store/baking/baking-selectors';

import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { isDefined } from '../utils/is-defined';
import { loadActivity } from '../utils/token-operations.util';

const KNOWN_BAKERS: Array<TzktMemberInterface> = [
  { address: EVERSTAKE_PAYOUTS_BAKER.address, alias: 'Everstake payouts' }
];

export const useContractActivity = (tokenSlug?: string): UseActivityInterface => {
  const dispatch = useDispatch();
  const selectedAccount = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const bakers = useBakersListSelector();

  const lastActivityRef = useRef<string>('');

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);

  const knownBakers = useMemo<Array<TzktMemberInterface>>(
    () =>
      [
        KNOWN_BAKERS,
        bakers.map(({ address, name }) => ({
          address,
          alias: name
        }))
      ].flat(),
    [bakers]
  );

  const initialLoad = useCallback(
    async (refresh = false) => {
      const activities = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, knownBakers);

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
      const lastActivityGroup = activities[activities.length - 1].sort((a, b) => b.id - a.id);

      if (lastActivityGroup.length > 0) {
        const lastItem = lastActivityGroup[lastActivityGroup.length - 1];

        if (lastItem.hash !== lastActivityRef.current) {
          lastActivityRef.current = lastItem.hash;

          if (isDefined(lastItem)) {
            const newActivity = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, knownBakers, lastItem);

            if (newActivity.length === 0) {
              setIsAllLoaded(true);
            }
            setActivities(prev => [...prev, ...newActivity]);
          }
        }
      }
    }
  };

  return {
    handleUpdate,
    handleRefresh,
    activities
  };
};

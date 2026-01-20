import memoizee from 'memoizee';
import { useEffect } from 'react';
import useSWR from 'swr';

import { fetchTzProfilesInfo } from 'src/apis/objkt';
import { ONE_MINUTE } from 'src/config/fixed-times';

import { useAnalytics } from './analytics/use-analytics.hook';

export const useTzProfile = (accountPkh: string) => {
  const { trackErrorEvent } = useAnalytics();
  const { data: tzProfile, error } = useSWR(
    `fetchTzProfilesInfo(${accountPkh})`,
    () => loadTzProfilesInfo(accountPkh),
    { dedupingInterval: 10000 }
  );

  useEffect(() => {
    if (error) {
      trackErrorEvent('UseTzProfileError', error, [accountPkh]);
    }
  }, [error, trackErrorEvent, accountPkh]);

  return tzProfile;
};

const loadTzProfilesInfo = memoizee(fetchTzProfilesInfo, {
  promise: true,
  maxAge: 3 * ONE_MINUTE
});

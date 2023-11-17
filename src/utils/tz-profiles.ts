import memoizee from 'memoizee';
import useSWR from 'swr';

import { fetchTzProfilesInfo } from 'src/apis/objkt';
import { ONE_MINUTE } from 'src/config/fixed-times';

export const useTzProfile = (accountPkh: string) => {
  const { data: tzProfile } = useSWR(`fetchTzProfilesInfo(${accountPkh})`, () => loadTzProfilesInfo(accountPkh), {
    dedupingInterval: 10000
  });

  return tzProfile;
};

const loadTzProfilesInfo = memoizee(fetchTzProfilesInfo, {
  promise: true,
  maxAge: 3 * ONE_MINUTE
});

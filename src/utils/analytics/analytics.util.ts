import { jitsuClient } from '@jitsu/sdk-js';

import { JITSU_ANALYTICS_KEY, JITSU_TRACKING_HOST } from '../env.utils';

export const jitsu = jitsuClient({
  tracking_host: JITSU_TRACKING_HOST,
  key: JITSU_ANALYTICS_KEY
});

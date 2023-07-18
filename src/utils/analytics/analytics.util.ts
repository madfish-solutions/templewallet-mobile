import { jitsuClient } from '@jitsu/sdk-js';
import fetch from 'cross-fetch';

import { JITSU_ANALYTICS_KEY, JITSU_TRACKING_HOST } from '../env.utils';

export const jitsu = jitsuClient({
  tracking_host: JITSU_TRACKING_HOST,
  key: JITSU_ANALYTICS_KEY,
  fetch,
  privacy_policy: 'strict'
});

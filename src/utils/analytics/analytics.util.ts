import { createClient } from '@segment/analytics-react-native';

import { SEGMENT_ANALYTICS_KEY } from '../env.utils';

export const segmentClient = createClient({
  writeKey: SEGMENT_ANALYTICS_KEY
});

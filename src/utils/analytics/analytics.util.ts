import { createClient } from '@segment/analytics-react-native';

import { SEGMENT_ANALYTICS } from '../env.utils';

if (!SEGMENT_ANALYTICS) {
  throw new Error("Require a 'SEGMENT_ANALYTICS' environment variable to be set");
}

export const segmentClient = createClient({
  writeKey: SEGMENT_ANALYTICS
});

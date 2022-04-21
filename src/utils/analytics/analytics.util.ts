import { createClient } from '@segment/analytics-react-native';

import { SEGMENT_ANALYTICS } from '../env.utils';

export const segmentClient = createClient({
  writeKey: SEGMENT_ANALYTICS || ''
});

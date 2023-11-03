import { jitsuClient } from '@jitsu/sdk-js/packages/javascript-sdk';
import fetch from 'cross-fetch';

import type { AnalyticsEventProperties } from 'src/types/analytics-event-properties.type';

import { JITSU_ANALYTICS_KEY, JITSU_TRACKING_HOST } from '../env.utils';

import { AnalyticsEventCategory } from './analytics-event.enum';

export const jitsu = jitsuClient({
  tracking_host: JITSU_TRACKING_HOST,
  key: JITSU_ANALYTICS_KEY,
  fetch
});

interface UserAnalyticsId {
  userId?: string;
  ABTestingCategory?: string;
}

export const sendAnalyticsEvent = (
  event: string,
  category: AnalyticsEventCategory = AnalyticsEventCategory.General,
  { userId, ABTestingCategory }: UserAnalyticsId = {},
  additionalProperties: AnalyticsEventProperties = {}
) =>
  jitsu.track(category, {
    userId,
    event,
    timestamp: Date.now(),
    properties: {
      event,
      category,
      ABTestingCategory,
      ...additionalProperties
    }
  });

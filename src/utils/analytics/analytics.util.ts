import { jitsuClient } from '@jitsu/sdk-js/packages/javascript-sdk';
import fetch from 'cross-fetch';
import { noop } from 'lodash-es';
import { Platform } from 'react-native';
import { getBuildNumber, getVersion } from 'react-native-device-info';

import { JITSU_ANALYTICS_KEY, JITSU_TRACKING_HOST } from '../env.utils';
import { getErrorDerivedEventProps, hideAddresses } from '../error-analytics-data.utils';

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

export type AnalyticsEventProperties = object;

export const sendAnalyticsEvent = (
  event: string,
  category: AnalyticsEventCategory = AnalyticsEventCategory.General,
  { userId, ABTestingCategory }: UserAnalyticsId = {},
  additionalProperties: AnalyticsEventProperties = {}
) =>
  jitsu
    .track(category, {
      userId,
      event,
      timestamp: Date.now(),
      properties: {
        event,
        category,
        ABTestingCategory,
        ...additionalProperties
      }
    })
    .catch(noop);

export const sendErrorAnalyticsEvent = (
  event: string,
  error: unknown,
  addressesToHide: string[] = [],
  userAnalyticsId: UserAnalyticsId = {},
  additionalProperties: AnalyticsEventProperties = {}
) =>
  sendAnalyticsEvent(event, AnalyticsEventCategory.Error, userAnalyticsId, {
    ...getErrorDerivedEventProps(error, addressesToHide),
    ...(hideAddresses(additionalProperties, addressesToHide) as AnalyticsEventProperties),
    appVersion: getVersion(),
    buildId: getBuildNumber(),
    os: Platform.OS,
    osVersion: Platform.Version
  });

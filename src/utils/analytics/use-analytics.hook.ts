import { useEffect } from 'react';

import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { OverlayEnum } from '../../navigator/enums/overlay.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useUserTestingGroupNameSelector } from '../../store/ab-testing/ab-testing-selectors';
import { useAnalyticsEnabledSelector, useUserIdSelector } from '../../store/settings/settings-selectors';
import { AnalyticsEventProperties } from '../../types/analytics-event-properties.type';
import { AnalyticsEventCategory } from './analytics-event.enum';
import { jitsu } from './analytics.util';

export const useAnalytics = () => {
  const userId = useUserIdSelector();
  const analyticsEnabled = useAnalyticsEnabledSelector();
  const testGroupName = useUserTestingGroupNameSelector();

  const trackEvent = async (
    event?: string,
    category: AnalyticsEventCategory = AnalyticsEventCategory.General,
    additionalProperties: AnalyticsEventProperties = {}
  ) =>
    event !== undefined &&
    analyticsEnabled &&
    jitsu.track(category, {
      userId,
      event,
      timestamp: new Date().getTime(),
      properties: {
        event,
        category,
        ABTestingCategory: testGroupName,
        ...additionalProperties
      }
    });

  const pageEvent = async (path: string, search: string, additionalProperties: AnalyticsEventProperties = {}) =>
    analyticsEnabled &&
    jitsu.track(AnalyticsEventCategory.PageOpened, {
      userId,
      name: path,
      timestamp: new Date().getTime(),
      category: AnalyticsEventCategory.PageOpened,
      properties: {
        url: `${path}${search}`,
        path: search,
        referrer: path,
        category: AnalyticsEventCategory.PageOpened,
        ABTestingCategory: testGroupName,
        ...additionalProperties
      }
    });

  return {
    trackEvent,
    pageEvent
  };
};

export const usePageAnalytic = (
  screen: ModalsEnum | ScreensEnum | OverlayEnum,
  search = '',
  additionalProperties?: AnalyticsEventProperties
) => {
  const { pageEvent } = useAnalytics();

  useEffect(() => void pageEvent(screen, search, additionalProperties), []);
};

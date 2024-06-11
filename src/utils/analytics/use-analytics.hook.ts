import { useCallback, useEffect } from 'react';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { OverlayEnum } from 'src/navigator/enums/overlay.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useUserTestingGroupNameSelector } from 'src/store/ab-testing/ab-testing-selectors';
import { useAnalyticsEnabledSelector, useUserIdSelector } from 'src/store/settings/settings-selectors';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';

import { AnalyticsEventCategory } from './analytics-event.enum';
import { AnalyticsEventProperties, jitsu, sendAnalyticsEvent } from './analytics.util';

export const useAnalytics = () => {
  const userId = useUserIdSelector();
  const analyticsEnabled = useAnalyticsEnabledSelector();
  const isAuthorized = useIsAuthorisedSelector();
  const defaultShouldSendAnalytics = analyticsEnabled && isAuthorized;
  const testGroupName = useUserTestingGroupNameSelector();

  const trackEvent = useCallback(
    async (
      event?: string,
      category: AnalyticsEventCategory = AnalyticsEventCategory.General,
      additionalProperties: AnalyticsEventProperties = {},
      shouldSendAnalytics: boolean = defaultShouldSendAnalytics
    ) =>
      event !== undefined &&
      shouldSendAnalytics &&
      sendAnalyticsEvent(event, category, { userId, ABTestingCategory: testGroupName }, additionalProperties),
    [defaultShouldSendAnalytics, userId, testGroupName]
  );

  const pageEvent = useCallback(
    async (path: string, search: string, additionalProperties: AnalyticsEventProperties = {}) =>
      defaultShouldSendAnalytics &&
      jitsu.track(AnalyticsEventCategory.PageOpened, {
        userId,
        name: path,
        timestamp: Date.now(),
        category: AnalyticsEventCategory.PageOpened,
        properties: {
          url: `${path}${search}`,
          path: search,
          referrer: path,
          category: AnalyticsEventCategory.PageOpened,
          ABTestingCategory: testGroupName,
          ...additionalProperties
        }
      }),
    [defaultShouldSendAnalytics, userId, testGroupName]
  );

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

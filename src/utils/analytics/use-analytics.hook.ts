import { useEffect } from 'react';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { OverlayEnum } from 'src/navigator/enums/overlay.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useAnalyticsEnabledSelector, useUserIdSelector } from 'src/store/settings/settings-selectors';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { AnalyticsEventProperties } from 'src/types/analytics-event-properties.type';

import { AnalyticsEventCategory } from './analytics-event.enum';
import { jitsu } from './analytics.util';

export const useAnalytics = () => {
  const userId = useUserIdSelector();
  const analyticsEnabled = useAnalyticsEnabledSelector();
  const isAuthorized = useIsAuthorisedSelector();
  const shouldSendAnalytics = analyticsEnabled && isAuthorized;

  const trackEvent = async (
    event?: string,
    category: AnalyticsEventCategory = AnalyticsEventCategory.General,
    additionalProperties: AnalyticsEventProperties = {}
  ) =>
    event !== undefined &&
    shouldSendAnalytics &&
    jitsu.track(category, {
      userId,
      event,
      timestamp: new Date().getTime(),
      properties: {
        event,
        category,
        ...additionalProperties
      }
    });

  const pageEvent = async (path: string, search: string, additionalProperties: AnalyticsEventProperties = {}) =>
    shouldSendAnalytics &&
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

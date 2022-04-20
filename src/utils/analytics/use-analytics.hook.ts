import { useAnalytics as useSegmentAnalytics } from '@segment/analytics-react-native';

import { useUserIdSelector } from '../../store/settings/settings-selectors';
import { AnalyticsEventCategory } from './analytics-event.enum';

export const useAnalytics = () => {
  const userId = useUserIdSelector();

  const { track, screen } = useSegmentAnalytics();

  const trackEvent = async (
    event: string,
    category: AnalyticsEventCategory = AnalyticsEventCategory.General,
    properties?: object
  ) =>
    track(category, {
      userId,
      event,
      timestamp: new Date().getTime(),
      properties: {
        ...properties,
        event,
        category
      }
    });

  const pageEvent = async (path: string, search: string, additionalProperties = {}) =>
    screen(AnalyticsEventCategory.PageOpened, {
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

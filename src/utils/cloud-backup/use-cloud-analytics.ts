import { useCallback } from 'react';

import { ToastError } from 'src/toast/error-toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isTruthy } from 'src/utils/is-truthy';

import { cloudTitle } from './index';

const CLOUD_ERROR = 'CLOUD_ERROR';
const CLOUD_SUCCESS = 'CLOUD_SUCCESS';

export const useCloudAnalytics = () => {
  const { trackEvent } = useAnalytics();

  const trackCloudSuccess = useCallback(
    (action: string) => {
      trackEvent(CLOUD_SUCCESS, AnalyticsEventCategory.General, { cloudTitle, action });
    },
    [trackEvent]
  );

  const trackCloudError = useCallback(
    (error: unknown, fallbackTitle?: string) => {
      const title = error instanceof ToastError ? error.title : fallbackTitle;
      const description = error instanceof ToastError ? error.description : undefined;

      const msg = error instanceof Error ? error.message : undefined;
      const message = isTruthy(description) && isTruthy(msg?.startsWith(description)) ? undefined : msg?.slice(0, 35);

      trackEvent(CLOUD_ERROR, AnalyticsEventCategory.General, { cloudTitle, title, description, message });
    },
    [trackEvent]
  );

  return { trackCloudError, trackCloudSuccess };
};

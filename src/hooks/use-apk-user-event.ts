import { useEffect } from 'react';

import { useFirstAppLaunchSelector } from 'src/store/settings/settings-selectors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

export const useApkUserEvent = () => {
  const { trackEvent } = useAnalytics();
  const isFirstAppLaunch = useFirstAppLaunchSelector();

  useEffect(() => {
    if (isFirstAppLaunch) {
      trackEvent('Custom APK User', AnalyticsEventCategory.General, {}, true);
    }
  }, []);
};

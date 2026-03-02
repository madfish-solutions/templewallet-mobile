import { useEffect, useState } from 'react';

import { showWarningToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { cloudTitle, isCloudAvailable } from './index';

export const useIsCloudAvailable = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | undefined>(undefined);

  const { trackEvent } = useAnalytics();

  useEffect(
    () =>
      void isCloudAvailable().then(available => {
        setIsAvailable(available);

        if (!available) {
          showWarningToast({
            title: `${cloudTitle} is not available on this device`,
            description: 'See if you need to enable it'
          });

          trackEvent('CLOUD_UNAVAILABLE', AnalyticsEventCategory.General, { cloudTitle });
        }
      }),
    []
  );

  return isAvailable;
};

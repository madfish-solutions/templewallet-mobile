import { useEffect } from 'react';

import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getAsyncStorageUsageDetails } from 'src/utils/get-async-storage-details';

export const useStorageAnalytics = () => {
  const { trackEvent } = useAnalytics();

  useEffect(
    () =>
      void getAsyncStorageUsageDetails().then(details =>
        trackEvent('STORAGES_STATE', AnalyticsEventCategory.General, { asyncStorage: details })
      ),
    [trackEvent]
  );
};

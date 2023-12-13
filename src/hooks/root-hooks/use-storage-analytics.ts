import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getAsyncStorageUsageDetails } from 'src/utils/get-async-storage-details';
import { useTimeout } from 'src/utils/hooks';

export const useStorageAnalytics = () => {
  const { trackEvent } = useAnalytics();

  // Delaying stats gathering (might get heavy on large stored data) to free-up runtime on app launch
  useTimeout(
    () =>
      void getAsyncStorageUsageDetails().then(details =>
        trackEvent('STORAGES_STATE', AnalyticsEventCategory.General, { asyncStorage: details })
      ),
    90000,
    [trackEvent]
  );
};

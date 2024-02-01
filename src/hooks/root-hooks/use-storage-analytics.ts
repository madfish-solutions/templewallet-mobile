import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getAsyncStorageUsageDetails } from 'src/utils/get-async-storage-details';
import { useTimeout } from 'src/utils/hooks';

export const useStorageAnalytics = () => {
  const { trackEvent } = useAnalytics();

  // Delaying stats gathering (might get heavy on large stored data) to free-up runtime on app launch
  useTimeout(
    () =>
      void getAsyncStorageUsageDetails().then(
        ({ totalValuesSize, sizesByKey, oversizeForKeys }) =>
          void trackEvent('ASYNC_STORAGE_STATE', AnalyticsEventCategory.General, {
            totalValuesSize,
            /** `string[]` is okay */
            oversizeForKeys: oversizeForKeys.length ? oversizeForKeys : undefined,
            /** Object with arbitrary keys is not okay - stringifying  */
            sizesByKey: JSON.stringify(sizesByKey)
          })
      ),
    90000,
    [trackEvent]
  );
};

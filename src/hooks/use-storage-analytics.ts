import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { useTimeout } from 'src/utils/hooks';
import { calculateStringSizeInBytes } from 'src/utils/string.utils';

export const useStorageAnalytics = () => {
  const { trackEvent } = useAnalytics();

  const measureAndSend = useCallback(
    () =>
      getAsyncStorageUsageDetails().then(asyncStorage =>
        trackEvent('STORAGES_STATE', AnalyticsEventCategory.General, { asyncStorage })
      ),
    [trackEvent]
  );

  // Delaying to not throttle initial app load
  useTimeout(measureAndSend, 10000);
};

const getAsyncStorageUsageDetails = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const values = await AsyncStorage.multiGet(keys);

  const sizesByKey: Record<string, number> = {};
  let totalValuesSize = 0;

  for (const [key, value] of values) {
    const size = value ? calculateStringSizeInBytes(value) : 0;
    totalValuesSize += size;
    sizesByKey[key] = size;
  }

  return { totalValuesSize, sizesByKey };
};

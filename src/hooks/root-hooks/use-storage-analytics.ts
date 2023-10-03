import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { calculateStringSizeInBytes } from 'src/utils/string.utils';

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

const getAsyncStorageUsageDetails = async () => {
  const keys = await AsyncStorage.getAllKeys();

  const records = await Promise.all(
    keys.map(key =>
      AsyncStorage.getItem(key).then(
        val => [key, val] as const,
        error => {
          console.error(error);

          return [key, Symbol()] as const;
        }
      )
    )
  );

  const sizesByKey: Record<string, number> = {};
  const oversizeForKeys: string[] = [];
  let totalValuesSize = 0;

  for (const [key, value] of records) {
    if (typeof value === 'symbol') {
      oversizeForKeys.push(key);
      continue;
    }

    const size = value ? calculateStringSizeInBytes(value) : 0;
    totalValuesSize += size;
    sizesByKey[key] = size;
  }

  const result = { totalValuesSize, sizesByKey, oversizeForKeys };

  return oversizeForKeys.length ? { ...result, oversizeForKeys } : result;
};

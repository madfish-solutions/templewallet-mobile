import AsyncStorage from '@react-native-async-storage/async-storage';

import { calculateStringSizeInBytes } from './string.utils';

export const getAsyncStorageUsageDetails = async () => {
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

  return { totalValuesSize, sizesByKey, oversizeForKeys };
};

import AsyncStorage from '@react-native-async-storage/async-storage';

import { calculateStringSizeInBytes } from './string.utils';

export const getAsyncStorageUsageDetails = async () => {
  const keys = await AsyncStorage.getAllKeys();

  const sizesByKey: Record<string, number> = {};
  const oversizeForKeys: string[] = [];
  let totalValuesSize = 0;

  for (const key of keys) {
    try {
      const value = await AsyncStorage.getItem(key);

      const size = await calculateStringSizeInBytesAsync(value);

      totalValuesSize += size;
      sizesByKey[key] = size;
    } catch (error) {
      console.error(error);

      oversizeForKeys.push(key);
    }
  }

  return { totalValuesSize, sizesByKey, oversizeForKeys };
};

/** Synchronous calculation might get heavy on runtime with large values */
const calculateStringSizeInBytesAsync = (value: string | null) =>
  value ? new Promise<number>(resolve => void setTimeout(() => void resolve(calculateStringSizeInBytes(value)), 0)) : 0;

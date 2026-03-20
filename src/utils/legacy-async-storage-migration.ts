import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

/**
 * One-time migration from legacy AsyncStorage (RKStorage / catalystLocalStorage) to current storage.
 * Run before creating the Redux store so rehydration sees migrated data.
 */
export async function migrateLegacyAsyncStorageIfNeeded(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const module = NativeModules.LegacyAsyncStorageMigration;
  if (!module?.getLegacyStorageData) {
    console.warn('Legacy AsyncStorage migration module not found');

    return;
  }

  try {
    const legacyData: Array<[string, string]> | null = await module.getLegacyStorageData();
    if (legacyData == null || legacyData.length === 0) return;

    await AsyncStorage.multiSet(legacyData.map(([k, v]) => [k, v ?? '']));
    await module.setLegacyMigrationDone();
  } catch (e) {
    if (__DEV__) console.warn('Legacy AsyncStorage migration failed (non-fatal):', e);
  }
}

import { Storage, StorageKey, StorageKeyReturnType } from '@airgap/beacon-sdk';
import { defaultValues } from '@airgap/beacon-sdk/dist/cjs/types/storage/StorageKeyReturnDefaults';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class BeaconStorage implements Storage {
  static async isSupported() {
    return true;
  }

  public async get<K extends StorageKey>(key: K): Promise<StorageKeyReturnType[K]> {
    const value = await AsyncStorage.getItem(key);

    if (value) {
      try {
        return JSON.parse(value);
      } catch {}
    }

    if (typeof defaultValues[key] === 'object') {
      return JSON.parse(JSON.stringify(defaultValues[key]));
    } else {
      return defaultValues[key];
    }
  }

  public async set<K extends StorageKey>(key: K, value: StorageKeyReturnType[K]): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  public async delete<K extends StorageKey>(key: K): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}

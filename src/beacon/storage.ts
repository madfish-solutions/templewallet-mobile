import { defaultValues, Storage, StorageKey, StorageKeyReturnType } from '@airgap/beacon-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { isDefined } from '../utils/is-defined';

type StorageChangedCallback = (arg: {
  eventType: 'storageCleared' | 'entryModified';
  key: string | null;
  oldValue: string | null;
  newValue: string | null;
}) => void;

export class BeaconStorage implements Storage {
  private callbacks: StorageChangedCallback[] = [];

  static async isSupported() {
    return true;
  }

  public async get<K extends StorageKey>(key: K): Promise<StorageKeyReturnType[K]> {
    const value = await AsyncStorage.getItem(key);

    if (isDefined(value)) {
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
    const oldValue = await this.get(key);
    await AsyncStorage.setItem(key, JSON.stringify(value));

    this.callbacks.forEach(callback =>
      callback({
        eventType: 'entryModified',
        key,
        oldValue: typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue),
        newValue: typeof value === 'string' ? value : JSON.stringify(value)
      })
    );
  }

  public async delete<K extends StorageKey>(key: K): Promise<void> {
    const oldValue = await this.get(key);
    await AsyncStorage.removeItem(key);

    this.callbacks.forEach(callback =>
      callback({
        eventType: 'entryModified',
        key,
        oldValue: typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue),
        newValue: null
      })
    );
  }

  public async subscribeToStorageChanged(callback: StorageChangedCallback): Promise<void> {
    if (this.callbacks.includes(callback)) {
      return;
    }

    this.callbacks.push(callback);
  }

  public getPrefixedKey<K extends StorageKey>(key: K): string {
    return typeof key === 'string' ? key : JSON.stringify(key);
  }
}

import type { AsyncStorageStatic } from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'redux' });

export const AsyncMmkvStorage: Pick<AsyncStorageStatic, 'getItem' | 'setItem' | 'removeItem'> = {
  async getItem(key: string) {
    return storage.getString(key) ?? null;
  },

  async setItem(key: string, value: string) {
    storage.set(key, value);
  },

  async removeItem(key: string) {
    storage.delete(key);
  }
};

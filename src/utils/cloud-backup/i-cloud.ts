import RNCloudFs from 'react-native-cloud-fs';

import { rejectOnTimeout } from 'src/utils/timeouts.util';

import {
  BackupObject,
  CLOUD_REQUEST_TIMEOUT,
  assertEncryptedBackupPresent,
  buildAndEncryptBackup,
  decryptFetchedBackup
} from './common';

const BACKUP_STORE_KEY = 'WALLET_BACKUP_JSON';

export const isCloudAvailable = async () => Boolean(RNCloudFs);

export const requestSignInToCloud = async () => {
  const synced = await rejectOnTimeout(
    RNCloudFs.syncKeyValueStoreData().catch(error => {
      console.error('RNCloudFs.syncKeyValueStoreData error:', error);

      return false;
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error("Syncing took too long. Try switching 'iCloud Drive' sync off & on again")
  );

  if (!Boolean(synced)) {
    throw new Error('See if iCloud sync is enabled');
  }

  return synced;
};

export const fetchCloudBackupDetails = () =>
  RNCloudFs.getKeyValueStoreObjectDetails(BACKUP_STORE_KEY).catch(error => {
    console.error('RNCloudFs.getKeyValueStoreData() error:', error);

    return undefined;
  });

export const fetchCloudBackup = async (password: string): Promise<BackupObject> => {
  const encryptedBackup = await rejectOnTimeout(
    RNCloudFs.getKeyValueStoreObject(BACKUP_STORE_KEY).catch(error => {
      console.error('RNCloudFs.getKeyValueStoreData() error:', error);

      throw new Error('Failed to read cloud. See if iCloud is enabled');
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error("Reading cloud took too long. Try switching 'iCloud Drive' sync off & on again")
  );

  assertEncryptedBackupPresent(encryptedBackup);

  return await decryptFetchedBackup(encryptedBackup, password);
};

export const saveCloudBackup = async (mnemonic: string, password: string) => {
  const encryptedData = await buildAndEncryptBackup(mnemonic, password);

  await RNCloudFs.putKeyValueStoreObject({ key: BACKUP_STORE_KEY, value: encryptedData }).catch(error => {
    console.error('RNCloudFs.putKeyValueStoreData() error:', error);

    throw new Error('Failed to upload to cloud');
  });

  const synced = await RNCloudFs.syncKeyValueStoreData();

  if (!Boolean(synced)) {
    throw new Error('Failed to sync after saving');
  }
};

export const eraseCloudBackup = async () => {
  await RNCloudFs.removeKeyValueStoreObject(BACKUP_STORE_KEY);

  const synced = await RNCloudFs.syncKeyValueStoreData();

  if (!Boolean(synced)) {
    throw new Error('Failed to sync after erasing attempt');
  }
};

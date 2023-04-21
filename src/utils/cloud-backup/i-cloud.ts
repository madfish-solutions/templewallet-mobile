import RNCloudFs from 'react-native-cloud-fs';

import { isTruthy } from 'src/utils/is-truthy';
import { rejectOnTimeout } from 'src/utils/timeouts.util';

import { CLOUD_REQUEST_TIMEOUT, EncryptedBackupObject, buildAndEncryptBackup, parseBackup } from './common';

const BACKUP_STORE_KEY = 'WALLET_BACKUP_JSON';

export const isCloudAvailable = async () => Boolean(RNCloudFs);

export const requestSignInToCloud = async () => {
  await syncCloud();

  return true;
};

export const doesCloudBackupExist = () =>
  fetchCloudBackupDetails().then(details => isTruthy(details) && details.valueLength > 0);

export const fetchCloudBackup = async (): Promise<EncryptedBackupObject | undefined> => {
  const encryptedBackup = await rejectOnTimeout(
    RNCloudFs.getKeyValueStoreObject(BACKUP_STORE_KEY).catch(error => {
      console.error('RNCloudFs.getKeyValueStoreData() error:', error);

      throw new Error('Failed to read cloud. See if iCloud is enabled');
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error("Reading cloud took too long. Try switching 'iCloud Drive' sync off & on again")
  );

  return parseBackup(encryptedBackup);
};

export const saveCloudBackup = async (mnemonic: string, password: string) => {
  const encryptedData = await buildAndEncryptBackup(mnemonic, password);

  await RNCloudFs.putKeyValueStoreObject({ key: BACKUP_STORE_KEY, value: encryptedData }).catch(error => {
    console.error('RNCloudFs.putKeyValueStoreData() error:', error);

    throw new Error('Failed to upload to cloud');
  });

  await syncCloud();
};

export const eraseCloudBackup = async () => {
  await RNCloudFs.removeKeyValueStoreObject(BACKUP_STORE_KEY);

  await syncCloud();
};

const syncCloud = async () => {
  const synced = await rejectOnTimeout(
    RNCloudFs.syncKeyValueStoreData().catch(error => {
      console.error('RNCloudFs.syncKeyValueStoreData error:', error);

      return false;
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error('Syncing took too long. See if iCloud is enabled')
  );

  if (!Boolean(synced)) {
    throw new Error('Failed to sync. See if iCloud is enabled');
  }
};

const fetchCloudBackupDetails = () =>
  RNCloudFs.getKeyValueStoreObjectDetails(BACKUP_STORE_KEY).catch(error => {
    console.error('RNCloudFs.getKeyValueStoreData() error:', error);

    throw error;
  });

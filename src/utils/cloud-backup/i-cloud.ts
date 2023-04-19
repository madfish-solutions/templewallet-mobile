import * as RNCloudStore from 'react-native-cloud-store';
import * as RNFS from 'react-native-fs';

import { isString } from 'src/utils/is-string';
import { rejectOnTimeout } from 'src/utils/timeouts.util';

import {
  BackupObject,
  CLOUD_REQUEST_TIMEOUT,
  assertEncryptedBackupPresent,
  buildAndEncryptBackup,
  decryptFetchedBackup,
  filename
} from './common';

export const isCloudAvailable = () => RNCloudStore.isICloudAvailable();

export const requestSignInToCloud = async () => {
  await syncCloud();

  return true;
};

export const fetchCloudBackupDetails = async () => {
  const path = await getTargetAbsolutePath();

  return await RNCloudStore.stat(path).catch(error => {
    if (isNotFoundError(error)) {
      return undefined;
    }

    console.error('RNCloudStore.stat() error:', error);

    return undefined;
  });
};

export const fetchCloudBackup = async (password: string): Promise<BackupObject> => {
  const path = await getTargetAbsolutePath();

  const encryptedBackup = await rejectOnTimeout(
    RNCloudStore.readFile(path).catch(error => {
      if (isNotFoundError(error)) {
        return undefined;
      }

      console.error('RNCloudStore.readFile() error:', error);

      throw new Error('Failed to read cloud. See if iCloud is enabled');
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error("Reading cloud took too long. Try switching 'iCloud Drive' sync off & on again")
  );

  assertEncryptedBackupPresent(encryptedBackup);

  return await decryptFetchedBackup(encryptedBackup, password);
};

export const saveCloudBackup = async (mnemonic: string, password: string, override = false) => {
  const encryptedData = await buildAndEncryptBackup(mnemonic, password);

  const path = await getTargetAbsolutePath();
  const exists = await RNCloudStore.exist(path);

  if (exists === true) {
    if (!override) {
      throw new Error('Backup already exists');
    }

    await RNCloudStore.writeFile(path, encryptedData, { override: true }).catch(error => {
      console.error('RNCloudStore.writeFile() error:', error);

      throw new Error('Failed to upload to cloud');
    });

    return;
  }

  const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

  await RNFS.writeFile(localPath, encryptedData, 'utf8');

  await RNCloudStore.upload(localPath, path)
    .catch(error => {
      console.error('RNCloudStore.upload() error:', error);

      throw new Error('Failed to upload to cloud');
    })
    .finally(() => RNFS.unlink(localPath).catch(console.error));
};

export const eraseCloudBackup = async () => {
  const path = await getTargetAbsolutePath();
  await RNCloudStore.unlink(path);
};

const getTargetAbsolutePath = async () => {
  const hiddenScopePath = await RNCloudStore.getDefaultICloudContainerPath();

  if (!isString(hiddenScopePath)) {
    throw new Error("iCloud is unavailable. See if it's enabled");
  }

  return `${hiddenScopePath}/${filename}`;
};

const syncCloud = async () => {
  RNCloudStore.registerGlobalDownloadEvent();
  RNCloudStore.registerGlobalUploadEvent();

  const path = await getTargetAbsolutePath();

  await rejectOnTimeout(
    RNCloudStore.download(path).catch(error => {
      if (isNotFoundError(error)) {
        return;
      }

      console.error('RNCloudStore.download() error:', error);

      throw new Error('Failed to sync cloud. See if iCloud is enabled');
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error("Syncing cloud took too long. Try switching 'iCloud Drive' sync off & on again")
  );
};

const isNotFoundError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.endsWith('not exists');
};

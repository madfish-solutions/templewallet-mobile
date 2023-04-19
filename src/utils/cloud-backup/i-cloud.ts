import RNCloudStorage, { CloudStorageScope } from 'react-native-cloud-storage';

import { rejectOnTimeout } from 'src/utils/timeouts.util';

import {
  BackupObject,
  CLOUD_REQUEST_TIMEOUT,
  assertEncryptedBackupPresent,
  buildAndEncryptBackup,
  decryptFetchedBackup,
  CLOUD_WALLET_FOLDER,
  targetPath
} from './common';

const scope = CloudStorageScope.AppData;

export const isCloudAvailable = () => RNCloudStorage.isCloudAvailable();

export const requestSignInToCloud = async () => {
  await syncCloud();

  return true;
};

export const fetchCloudBackupDetails = () =>
  RNCloudStorage.stat(targetPath, scope).catch(error => {
    if (isNotFoundError(error)) {
      return undefined;
    }

    console.error(error);

    return undefined;
  });

export const fetchCloudBackup = async (password: string): Promise<BackupObject> => {
  const encryptedBackup = await rejectOnTimeout(
    RNCloudStorage.readFile(targetPath, scope).catch(error => {
      if (isNotFoundError(error)) {
        return undefined;
      }

      console.error(error);

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

  await RNCloudStorage.mkdir(CLOUD_WALLET_FOLDER, scope).catch(console.error);

  await RNCloudStorage.writeFile(targetPath, encryptedData, scope).catch(error => {
    console.error(error);

    throw new Error('Failed to upload to cloud');
  });

  await syncCloud();
};

export const eraseCloudBackup = async () => {
  await RNCloudStorage.unlink(targetPath, scope).catch(error => {
    if (isNotFoundError(error)) {
      return undefined;
    }
  });

  await syncCloud();
};

const syncCloud = () =>
  rejectOnTimeout(
    RNCloudStorage.readFile(targetPath, scope).catch(error => {
      if (isNotFoundError(error)) {
        return undefined;
      }

      console.error(error);

      throw new Error('Failed to sync cloud. See if iCloud is enabled');
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error("Syncing cloud took too long. Try switching 'iCloud Drive' sync off & on again")
  );

const isNotFoundError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.startsWith('No directory found for scope') || error.message.endsWith('not found');
};

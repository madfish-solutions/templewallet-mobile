import RNCloudFs from 'react-native-cloud-fs';

import { rejectOnTimeout } from '../timeouts.util';
import { BackupFileInterface, CLOUD_REQUEST_TIMEOUT, decryptFetchedCloudBackup, targetPathAndScope } from './common';

export const isCloudAvailable = async () => {
  if (Boolean(RNCloudFs) === false) {
    return false;
  }

  return await RNCloudFs.isAvailable().catch(error => {
    console.error('RNCloudFs.isAvailable() error:', error);

    return false;
  });
};

export const requestSignInToCloud = async () => true;

export const fetchCloudBackupDetails = () =>
  RNCloudFs.getIcloudDocumentDetails(targetPathAndScope).catch(error => {
    console.error('RNCloudFs.getIcloudDocumentDetails() error:', error);

    return undefined;
  });

export const fetchCloudBackup = async (password: string): Promise<BackupFileInterface> => {
  const encryptedBackup = await rejectOnTimeout(
    RNCloudFs.getIcloudDocument(targetPathAndScope).catch(error => {
      console.error('RNCloudFs.getIcloudDocument() error:', error);

      throw new Error('See if iCloud is enabled');
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error("Reading cloud took too long. Try switching 'iCloud Drive' sync off & on again")
  );

  return await decryptFetchedCloudBackup(encryptedBackup, password);
};

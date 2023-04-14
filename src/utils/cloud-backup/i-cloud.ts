import RNCloudFs from 'react-native-cloud-fs';

import { rejectOnTimeout } from '../timeouts.util';
import { BackupFileInterface, CLOUD_REQUEST_TIMEOUT, decryptFetchedCloudBackup, targetPathAndScope } from './common';

export const isCloudAvailable = async () => {
  if (Boolean(RNCloudFs) === false) {
    return false;
  }

  return await RNCloudFs.isAvailable().catch(error => {
    console.error('RNCloudFs.isAvailable error:', error);

    return false;
  });
};

export const requestSignInToCloud = async () => {
  await syncCloud();

  return true;
};

const syncCloud = async () => {
  await rejectOnTimeout(
    /* We gave up on `RNCloudFs.syncCloud` due to its flaws.
     * Now we just pre-fetch the one document we need,
     * since it will also 'sync' this one file.
     */
    RNCloudFs.getIcloudDocument(targetPathAndScope).catch(error => {
      console.error('syncCloud > RNCloudFs.getIcloudDocument error:', error);

      throw new Error('See if iCloud is enabled');
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error("Syncing took too long. Try switching 'iCloud Drive' sync off & on again")
  );
};

export const fetchCloudBackupDetails = () =>
  RNCloudFs.getIcloudDocumentDetails(targetPathAndScope).catch(error => {
    console.error('RNCloudFs.getIcloudDocumentDetails() error:', error);

    return undefined;
  });

export const fetchCloudBackup = async (password: string): Promise<BackupFileInterface> => {
  const encryptedBackup = await rejectOnTimeout(
    RNCloudFs.getIcloudDocument(targetPathAndScope).catch(error => {
      console.error('RNCloudFs.get${cloud}Document error:', error);
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error('Reading cloud took too long')
  );

  return await decryptFetchedCloudBackup(encryptedBackup, password);
};

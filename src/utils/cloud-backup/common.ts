import RNCloudFs, { TargetPathAndScope } from 'react-native-cloud-fs';
import * as RNFS from 'react-native-fs';
import { secureCellSealWithPassphraseEncrypt64, secureCellSealWithPassphraseDecrypt64 } from 'react-native-themis';

import { isAndroid, isIOS } from 'src/config/system';
import { isString } from 'src/utils/is-string';

import PackageJSON from '../../../package.json';

export const cloudTitle = isIOS ? 'iCloud' : 'Google Drive';
export const FAILED_TO_LOGIN_ERR_TITLE = isIOS ? 'Failed to sync cloud' : 'Failed to log-in';

export const scope = 'hidden';
export const CLOUD_WALLET_FOLDER = 'tw-mobile';
export const filename = 'wallet-backup.json';
const targetPath = `${CLOUD_WALLET_FOLDER}/${filename}`;
export const targetPathAndScope: TargetPathAndScope = { scope, targetPath };

export const CLOUD_REQUEST_TIMEOUT = 15000;

export interface BackupFileInterface {
  version: string;
  mnemonic: string;
  platformOS: 'ios' | 'android';
}

export const saveCloudBackup = async (mnemonic: string, password: string) => {
  const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

  const fileContent: BackupFileInterface = {
    version: PackageJSON.version,
    mnemonic,
    platformOS: isIOS ? 'ios' : 'android'
  };

  const encryptedData = await secureCellSealWithPassphraseEncrypt64(password, JSON.stringify(fileContent));

  await RNFS.writeFile(localPath, encryptedData, 'utf8');

  const fileId = await RNCloudFs.copyToCloud({
    ...targetPathAndScope,
    mimeType: 'application/json',
    sourcePath: { path: localPath }
  })
    .catch(error => {
      console.error('RNCloudFs.copyToCloud() error:', error);

      throw new Error('Failed to upload to cloud');
    })
    .finally(() => RNFS.unlink(localPath).catch(console.error));

  const fileExists = await checkIfBackupExists(fileId);

  if (fileExists === false) {
    throw new Error('File not found after saving');
  }
};

export const decryptFetchedCloudBackup = async (
  encryptedBackup: string | nullish,
  password: string
): Promise<BackupFileInterface> => {
  if (!isString(encryptedBackup)) {
    throw new Error('Cloud backup not found');
  }

  const backupFileStr = await secureCellSealWithPassphraseDecrypt64(password, encryptedBackup).catch(error => {
    console.error(error);

    throw new Error('Password is incorrect');
  });

  try {
    return JSON.parse(backupFileStr);
  } catch (error) {
    console.error(error);

    throw new Error('Backup is broken');
  }
};

const checkIfBackupExists = async (fileId?: string) => {
  if (!isString(fileId)) {
    return false;
  }

  return await RNCloudFs.fileExists(isAndroid ? { scope, fileId } : targetPathAndScope).catch(error => {
    console.error('RNCloudFs.fileExists() error:', error);

    return false;
  });
};

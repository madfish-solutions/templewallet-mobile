import { secureCellSealWithPassphraseDecrypt64 } from 'react-native-themis';

import { isIOS } from 'src/config/system';
import { isString } from 'src/utils/is-string';

import PackageJSON from '../../../package.json';

export const cloudTitle = isIOS ? 'iCloud' : 'Google Drive';
export const FAILED_TO_LOGIN_ERR_TITLE = isIOS ? 'Failed to sync cloud' : 'Failed to log-in';

export const CLOUD_REQUEST_TIMEOUT = 15000;

export interface BackupObject {
  version: string;
  mnemonic: string;
  platformOS: 'ios' | 'android';
}

export const buildBackupObject = (mnemonic: string): BackupObject => ({
  version: PackageJSON.version,
  mnemonic,
  platformOS: isIOS ? 'ios' : 'android'
});

export const decryptFetchedCloudBackup = async (
  encryptedBackup: string | nullish,
  password: string
): Promise<BackupObject> => {
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

import { secureCellSealWithPassphraseEncrypt64, secureCellSealWithPassphraseDecrypt64 } from 'react-native-themis';

import { isIOS } from 'src/config/system';
import { isString } from 'src/utils/is-string';

import PackageJSON from '../../../package.json';

export const CLOUD_REQUEST_TIMEOUT = 15000;

export interface BackupObject {
  version: string;
  mnemonic: string;
  platformOS: 'ios' | 'android';
}

export const buildAndEncryptBackup = async (mnemonic: string, password: string): Promise<string> => {
  const backup: BackupObject = {
    version: PackageJSON.version,
    mnemonic,
    platformOS: isIOS ? 'ios' : 'android'
  };

  return await secureCellSealWithPassphraseEncrypt64(password, JSON.stringify(backup));
};

export const decryptFetchedBackup = async (encryptedBackup: string, password: string): Promise<BackupObject> => {
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

export function assertEncryptedBackupPresent(encryptedBackup?: string): asserts encryptedBackup is string {
  if (!isString(encryptedBackup)) {
    throw new Error('Cloud backup not found');
  }
}

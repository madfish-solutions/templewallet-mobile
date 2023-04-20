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
    mnemonic: await secureCellSealWithPassphraseEncrypt64(password, mnemonic),
    platformOS: isIOS ? 'ios' : 'android'
  };

  return JSON.stringify(backup);
};

export const decryptFetchedBackup = async (encryptedBackup: string, password: string): Promise<BackupObject> => {
  let backup: BackupObject;
  try {
    backup = JSON.parse(encryptedBackup);
  } catch (error) {
    console.error(error);

    throw new Error('Backup is broken');
  }

  backup.mnemonic = await secureCellSealWithPassphraseDecrypt64(password, backup.mnemonic).catch(error => {
    console.error(error);

    throw new Error('Password is incorrect');
  });

  return backup;
};

export function assertEncryptedBackupPresent(encryptedBackup?: string): asserts encryptedBackup is string {
  if (!isString(encryptedBackup)) {
    throw new Error('Cloud backup not found');
  }
}

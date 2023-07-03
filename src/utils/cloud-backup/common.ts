import { secureCellSealWithPassphraseEncrypt64, secureCellSealWithPassphraseDecrypt64 } from 'react-native-themis';

import { isIOS } from 'src/config/system';
import { APP_VERSION } from 'src/utils/env.utils';
import { isString } from 'src/utils/is-string';

export const CLOUD_REQUEST_TIMEOUT = 15000;

export interface BackupObject {
  version: string;
  mnemonic: string;
  platformOS: 'ios' | 'android';
}

export interface EncryptedBackupObject extends Omit<BackupObject, 'mnemonic'> {
  encryptedMnemonic: string;
}

export const buildAndEncryptBackup = async (mnemonic: string, password: string): Promise<string> => {
  const backup: EncryptedBackupObject = {
    version: APP_VERSION,
    encryptedMnemonic: await secureCellSealWithPassphraseEncrypt64(password, mnemonic),
    platformOS: isIOS ? 'ios' : 'android'
  };

  return JSON.stringify(backup);
};

export const parseBackup = (encryptedBackup: string | undefined): EncryptedBackupObject | undefined => {
  if (!isString(encryptedBackup)) {
    return;
  }

  try {
    return JSON.parse(encryptedBackup);
  } catch (error) {
    console.error(error);

    throw new Error('Backup content is broken');
  }
};

export const decryptCloudBackup = async (
  encryptedBackup: EncryptedBackupObject,
  password: string
): Promise<BackupObject> => {
  const { encryptedMnemonic, ...backupBase } = encryptedBackup;

  const mnemonic = await secureCellSealWithPassphraseDecrypt64(password, encryptedMnemonic).catch(error => {
    console.error(error);

    throw new Error('Password is incorrect');
  });

  return { ...backupBase, mnemonic };
};

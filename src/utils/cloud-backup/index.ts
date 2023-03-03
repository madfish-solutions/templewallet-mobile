import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { isString } from 'lodash';
import RNCloudFs from 'react-native-cloud-fs';
import * as RNFS from 'react-native-fs';
import { secureCellSealWithPassphraseEncrypt64, secureCellSealWithPassphraseDecrypt64 } from 'react-native-themis';

import { isAndroid } from 'src/config/system';

import PackageJSON from '../../../package.json';

export { keepRestoredCloudBackup, getRestoredCloudBackup } from './keeper';

export const cloudTitle = isAndroid ? 'Google Drive' : 'iCloud';

const CLOUD_WALLET_FOLDER = 'temple-wallet';
const filename = 'wallet-backup.json';
const targetPath = `${CLOUD_WALLET_FOLDER}/${filename}`;

export interface BackupFileInterface {
  version: string;
  mnemonic: string;
}

export const isCloudAvailable = () => {
  if (isAndroid) {
    return true;
  }

  return RNCloudFs.isAvailable();
};

export const requestSignInToCloud = async () => {
  if (!isAndroid) {
    return true;
  }

  try {
    GoogleSignin.configure();

    await GoogleSignin.signOut();
    /* Syncing signed-in state to RNCloudFS */
    await RNCloudFs.logout();

    const user = await GoogleSignin.signIn();

    if (user == null) {
      return false;
    }

    /* Syncing signed-in state to RNCloudFS */
    return await RNCloudFs.loginIfNeeded();
  } catch (error) {
    console.error(error);

    return false;
  }
};

export const fetchCloudBackupFileDetails = async () => {
  const backups = await RNCloudFs.listFiles({
    scope: 'hidden',
    targetPath: CLOUD_WALLET_FOLDER
  });

  return backups.files?.find(file => file.name.endsWith(filename));
};

export const saveCloudBackup = async (mnemonic: string, password: string) => {
  const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

  const fileContent: BackupFileInterface = {
    version: PackageJSON.version,
    mnemonic
  };

  const encryptedData = await secureCellSealWithPassphraseEncrypt64(password, JSON.stringify(fileContent));

  await RNFS.writeFile(localPath, encryptedData, 'utf8');

  let fileId: string | undefined;
  try {
    fileId = await RNCloudFs.copyToCloud({
      mimeType: 'application/json',
      scope: 'hidden',
      sourcePath: { path: localPath },
      targetPath
    });
  } catch (error) {
    console.error(error);
  }

  await RNFS.unlink(localPath).catch(console.error);

  const fileExists = await checkIfBackupExists(fileId);

  if (fileExists === false) {
    throw new Error('Failed to save file');
  }
};

const checkIfBackupExists = async (fileId?: string) => {
  if (!isString(fileId)) {
    return false;
  }

  let fileExists = false;
  try {
    fileExists = await RNCloudFs.fileExists(isAndroid ? { scope: 'hidden', fileId } : { scope: 'hidden', targetPath });
  } catch (error) {
    console.error(error);
  }

  return fileExists;
};

export const fetchCloudBackup = async (password: string, fileId: string): Promise<BackupFileInterface> => {
  const encryptedBackup = isAndroid
    ? await RNCloudFs.getGoogleDriveDocument(fileId)
    : await RNCloudFs.getIcloudDocument(filename);

  if (!isString(encryptedBackup)) {
    throw new Error('Cloud backup not found');
  }

  try {
    const backupFileStr = await secureCellSealWithPassphraseDecrypt64(password, encryptedBackup);

    return JSON.parse(backupFileStr);
  } catch (error) {
    console.error(error);

    throw new Error('Password is incorrect');
  }
};

import { isString } from 'lodash';
import RNCloudFs from 'react-native-cloud-fs';
import * as RNFS from 'react-native-fs';

import { isAndroid } from 'src/config/system';

import PackageJSON from '../../package.json';
import { AesEncryptor } from './aes-encryptor';

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

export const fetchCloudBackupFileDetails = async () => {
  const backups = await RNCloudFs.listFiles({
    scope: 'hidden',
    targetPath: CLOUD_WALLET_FOLDER
  });

  return backups.files?.find(file => file.name === targetPath);
};

export const saveCloudBackup = async (mnemonic: string, password: string) => {
  const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

  const encryptor = new AesEncryptor();

  const fileContent: BackupFileInterface = {
    version: PackageJSON.version,
    mnemonic
  };

  const encryptedData = await encryptor.encrypt(password, JSON.stringify(fileContent));

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
    console.error('RNCloudFs.copyToCloud errored:', { error });

    throw new Error('Failed to save file');
  }

  await RNFS.unlink(localPath).catch(error => {
    console.error(error);
  });

  if (!isString(fileId)) {
    throw new Error('Failed to save file');
  }

  let fileExists: boolean;
  try {
    fileExists = await RNCloudFs.fileExists(isAndroid ? { scope: 'hidden', fileId } : { scope: 'hidden', targetPath });
  } catch (error) {
    console.error('File doesnt exist:', { error });

    throw new Error('Failed to save file');
  }

  if (fileExists === false) {
    throw new Error('Failed to save file');
  }
};

export const fetchCloudBackup = async (password: string, fileId: string): Promise<BackupFileInterface> => {
  const encryptedBackup = isAndroid
    ? await RNCloudFs.getGoogleDriveDocument(fileId)
    : await RNCloudFs.getIcloudDocument(filename);

  if (!isString(encryptedBackup)) {
    throw new Error('Cloud backup not found');
  }

  const encryptor = new AesEncryptor();

  try {
    const backupFileStr = await encryptor.decrypt(password, encryptedBackup);

    return JSON.parse(backupFileStr);
  } catch (error) {
    console.error(error);

    throw new Error('Password is incorrect');
  }
};

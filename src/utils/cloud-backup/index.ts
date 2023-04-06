import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import RNCloudFs from 'react-native-cloud-fs';
import * as RNFS from 'react-native-fs';
import { secureCellSealWithPassphraseEncrypt64, secureCellSealWithPassphraseDecrypt64 } from 'react-native-themis';

import { isAndroid, isIOS } from 'src/config/system';
import { isString } from 'src/utils/is-string';

import PackageJSON from '../../../package.json';
import { rejectOnTimeout } from '../timeouts.util';

export { keepRestoredCloudBackup, getRestoredCloudBackup } from './keeper';

export const cloudTitle = isIOS ? 'iCloud' : 'Google Drive';

const CLOUD_WALLET_FOLDER = 'temple-wallet-mobile';
const filename = 'temple-wallet-backup.json';
const targetPath = `${CLOUD_WALLET_FOLDER}/${filename}`;

const CLOUD_REQUEST_TIMEOUT = 15000;

export interface BackupFileInterface {
  version: string;
  mnemonic: string;
  platformOS: 'ios' | 'android';
}

export const isCloudAvailable = async () => {
  if (Boolean(RNCloudFs) === false) {
    return false;
  }

  if (isAndroid) {
    return true;
  }

  if (isIOS) {
    try {
      return await RNCloudFs.isAvailable();
    } catch (error) {
      console.error('RNCloudFs.isAvailable error:', error);

      return false;
    }
  }

  return false;
};

export const requestSignInToCloud = async () => {
  if (isIOS) {
    await syncCloud();

    return true;
  }

  await assureGooglePlayServicesAvailable();

  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });

  await preLogOut();

  try {
    const user = await GoogleSignin.signIn();

    if (user == null) {
      return false;
    }
  } catch (error) {
    console.error('GoogleSignin.signIn error:', { error });

    if (
      [statusCodes.SIGN_IN_CANCELLED, statusCodes.IN_PROGRESS].includes(
        (error as { code: keyof typeof statusCodes })?.code
      )
    ) {
      return false;
    }

    throw new Error('Failed to sign-in with Google');
  }

  try {
    /* Syncing signed-in state to RNCloudFS */
    return await RNCloudFs.loginIfNeeded();
  } catch (error) {
    console.error('RNCloudFs.loginIfNeeded error:', { error });

    throw new Error('Failed to sync sign-in status');
  }
};

const syncCloud = async () => {
  if (!isIOS) {
    return;
  }

  await rejectOnTimeout(
    /* We gave up on `RNCloudFs.syncCloud` due to its flaws.
     * Now we just pre-fetch the one document we need,
     * since it will also 'sync' this one file.
     */
    RNCloudFs.getIcloudDocument(filename).catch(error => {
      console.error('syncCloud error:', error);

      throw new Error('Failed to sync cloud. See if iCloud is enabled');
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error('Cloud syncing took too long. See if iCloud is enabled')
  );
};

export const fetchCloudBackupFileDetails = async () => {
  const backups = await RNCloudFs.listFiles({
    scope: 'hidden',
    targetPath: CLOUD_WALLET_FOLDER
  });

  return backups.files?.find(file => file.name.endsWith(filename)) || null;
};

export const saveCloudBackup = async (mnemonic: string, password: string) => {
  const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

  const fileContent: BackupFileInterface = {
    version: PackageJSON.version,
    mnemonic,
    platformOS: isIOS ? 'ios' : 'android'
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

    await RNFS.unlink(localPath).catch(console.error);

    throw new Error('Failed to upload to cloud');
  }

  await RNFS.unlink(localPath).catch(console.error);

  const fileExists = await checkIfBackupExists(fileId);

  if (fileExists === false) {
    throw new Error('File not found after saving');
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
  const encryptedBackupPromise = isAndroid
    ? RNCloudFs.getGoogleDriveDocument(fileId)
    : RNCloudFs.getIcloudDocument(filename);

  const encryptedBackup = await rejectOnTimeout(
    encryptedBackupPromise.catch(error => {
      console.error('RNCloudFs.get${cloud}Document error:', error);
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error('Reading cloud took too long')
  );

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

const assureGooglePlayServicesAvailable = async () => {
  let hasPlayServices = false;
  try {
    hasPlayServices = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  } catch (error) {
    console.error('GoogleSignin.hasPlayServices error:', { error });
  }

  if (!hasPlayServices) {
    throw new Error("Google Play services aren't available");
  }
};

const preLogOut = async () => {
  try {
    await GoogleSignin.signOut();
    /* Syncing signed-in state to RNCloudFS */
    await RNCloudFs.logout();
  } catch (error) {
    console.error('preLogOut() error:', { error });

    throw new Error('Failed to pre-log-out');
  }
};

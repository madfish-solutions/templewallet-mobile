import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import RNCloudFs, { TargetPathAndScope } from 'react-native-cloud-fs';
import * as RNFS from 'react-native-fs';
import { secureCellSealWithPassphraseEncrypt64, secureCellSealWithPassphraseDecrypt64 } from 'react-native-themis';

import { isAndroid, isIOS } from 'src/config/system';
import { isString } from 'src/utils/is-string';

import PackageJSON from '../../../package.json';
import { rejectOnTimeout } from '../timeouts.util';

export { keepRestoredCloudBackup, getRestoredCloudBackup } from './keeper';

export const cloudTitle = isIOS ? 'iCloud' : 'Google Drive';
export const FAILED_TO_LOGIN_ERR_TITLE = `Failed to log-in${isIOS ? '. See if iCloud is enabled' : ''}`;

const scope = 'hidden';
const CLOUD_WALLET_FOLDER = 'tw-mobile';
const filename = 'wallet-backup.json';
const targetPath = `${CLOUD_WALLET_FOLDER}/${filename}`;
const targetPathAndScope: TargetPathAndScope = { scope, targetPath };

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
    RNCloudFs.getIcloudDocument(targetPathAndScope).catch(error => {
      console.error('syncCloud > RNCloudFs.getIcloudDocument error:', error);

      throw new Error('Failed to sync cloud');
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error('Cloud syncing took too long')
  );
};

export const fetchCloudBackupFileDetails = async () => {
  const backups = await RNCloudFs.listFiles({
    scope,
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

const checkIfBackupExists = async (fileId?: string) => {
  if (!isString(fileId)) {
    return false;
  }

  const fileExists = await RNCloudFs.fileExists(isAndroid ? { scope, fileId } : targetPathAndScope).catch(error => {
    console.error('RNCloudFs.fileExists() error:', error);

    return false;
  });

  return fileExists;
};

export const fetchCloudBackup = async (password: string, fileId: string): Promise<BackupFileInterface> => {
  const encryptedBackupPromise = isAndroid
    ? RNCloudFs.getGoogleDriveDocument(fileId)
    : RNCloudFs.getIcloudDocument(targetPathAndScope);

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
  const hasPlayServices = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }).catch(error => {
    console.error('GoogleSignin.hasPlayServices error:', error);

    return false;
  });

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

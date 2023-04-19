import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import RNCloudFs, { TargetPathAndScope } from 'react-native-cloud-fs';
import * as RNFS from 'react-native-fs';

import { isString } from 'src/utils/is-string';
import { rejectOnTimeout } from 'src/utils/timeouts.util';

import {
  BackupObject,
  CLOUD_WALLET_FOLDER,
  filename,
  targetPath,
  CLOUD_REQUEST_TIMEOUT,
  assertEncryptedBackupPresent,
  buildAndEncryptBackup,
  decryptFetchedBackup
} from './common';

const scope = 'hidden';
const targetPathAndScope: TargetPathAndScope = { scope, targetPath };

export const isCloudAvailable = async () => Boolean(RNCloudFs);

export const requestSignInToCloud = async () => {
  await ensureGooglePlayServicesAvailable();

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
    console.error('GoogleSignin.signIn() error:', { error });

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
    console.error('RNCloudFs.loginIfNeeded() error:', { error });

    throw new Error('Failed to sync sign-in status');
  }
};

export const fetchCloudBackupDetails = async () => {
  const data = await RNCloudFs.listFiles<'Android'>({
    scope,
    targetPath: CLOUD_WALLET_FOLDER
  }).catch(error => {
    console.error("NCloudFs.listFiles<'Android'> error:", error);
  });

  return data?.files?.find(file => file.name.endsWith(filename));
};

export const fetchCloudBackup = async (password: string): Promise<BackupObject> => {
  const encryptedBackup = await rejectOnTimeout(
    fetchCloudBackupDetails()
      .then(details => details && RNCloudFs.getGoogleDriveDocument(details.id))
      .catch(error => {
        console.error('RNCloudFs.getGoogleDriveDocument() error:', error);

        throw new Error("Failed to read cloud. See if it's enabled");
      }),
    CLOUD_REQUEST_TIMEOUT,
    new Error('Reading cloud took too long')
  );

  assertEncryptedBackupPresent(encryptedBackup);

  return await decryptFetchedBackup(encryptedBackup, password);
};

export const saveCloudBackup = async (mnemonic: string, password: string) => {
  const encryptedData = await buildAndEncryptBackup(mnemonic, password);

  const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

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

export const eraseCloudBackup = () => {
  throw new Error('Use Google Drive to remove app files');
};

const checkIfBackupExists = async (fileId?: string) => {
  if (!isString(fileId)) {
    return false;
  }

  return await RNCloudFs.fileExists({ scope, fileId }).catch(error => {
    console.error('RNCloudFs.fileExists() error:', error);

    return false;
  });
};

const ensureGooglePlayServicesAvailable = async () => {
  const hasPlayServices = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }).catch(error => {
    console.error('GoogleSignin.hasPlayServices() error:', error);

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

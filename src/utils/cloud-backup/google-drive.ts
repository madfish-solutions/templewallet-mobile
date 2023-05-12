/**
 * OAuth is configured through Firebase.
 * See: https://github.com/react-native-google-signin/google-signin/blob/master/docs/android-guide.md
 */
import { GoogleSignin, statusCodes, NativeModuleError } from '@react-native-google-signin/google-signin';
import RNCloudFs from 'react-native-cloud-fs';
import * as RNFS from 'react-native-fs';

import { isString } from 'src/utils/is-string';
import { rejectOnTimeout } from 'src/utils/timeouts.util';

import { CLOUD_REQUEST_TIMEOUT, EncryptedBackupObject, buildAndEncryptBackup, parseBackup } from './common';

const scope = 'hidden';
const filename = 'wallet-backup.json';

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

    const errorCode = (error as NativeModuleError)?.code;

    if ([statusCodes.SIGN_IN_CANCELLED, statusCodes.IN_PROGRESS].includes(errorCode)) {
      return false;
    }

    throw new Error(`Failed to sign-in to Google with code: ${errorCode}`);
  }

  try {
    /* Syncing signed-in state to RNCloudFS */
    return await RNCloudFs.loginIfNeeded();
  } catch (error) {
    console.error('RNCloudFs.loginIfNeeded() error:', { error });

    throw new Error('Failed to sync sign-in status');
  }
};

export const doesCloudBackupExist = () => fetchCloudBackupDetails().then(details => Boolean(details));

export const fetchCloudBackup = async (): Promise<EncryptedBackupObject | undefined> => {
  const details = await fetchCloudBackupDetails();

  if (!details) {
    return;
  }

  const encryptedBackup = await rejectOnTimeout(
    RNCloudFs.getGoogleDriveDocument(details.id).catch(error => {
      console.error('RNCloudFs.getGoogleDriveDocument() error:', error);

      throw new Error("Failed to read cloud. See if it's enabled");
    }),
    CLOUD_REQUEST_TIMEOUT,
    new Error('Reading cloud took too long')
  );

  return parseBackup(encryptedBackup);
};

export const saveCloudBackup = async (mnemonic: string, password: string) => {
  const encryptedData = await buildAndEncryptBackup(mnemonic, password);

  const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

  await RNFS.writeFile(localPath, encryptedData, 'utf8');

  const fileId = await RNCloudFs.copyToCloud({
    scope,
    targetPath: filename,
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

const fetchCloudBackupDetails = async () => {
  const data = await RNCloudFs.listFiles<'Android'>({
    scope,
    targetPath: ''
  }).catch(error => {
    console.error("NCloudFs.listFiles<'Android'> error:", error);

    throw error;
  });

  return data.files?.find(file => file.name.endsWith(filename));
};

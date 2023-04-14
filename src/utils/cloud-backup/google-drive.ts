import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import RNCloudFs from 'react-native-cloud-fs';

import { rejectOnTimeout } from '../timeouts.util';
import {
  BackupFileInterface,
  CLOUD_WALLET_FOLDER,
  CLOUD_REQUEST_TIMEOUT,
  scope,
  filename,
  decryptFetchedCloudBackup
} from './common';

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
  });

  return data.files?.find(file => file.name.endsWith(filename));
};

export const fetchCloudBackup = async (password: string): Promise<BackupFileInterface> => {
  const encryptedBackup = await rejectOnTimeout(
    fetchCloudBackupDetails()
      .then(details => details && RNCloudFs.getGoogleDriveDocument(details.id))
      .catch(error => {
        console.error('RNCloudFs.getGoogleDriveDocument() error:', error);
      }),
    CLOUD_REQUEST_TIMEOUT,
    new Error('Reading cloud took too long')
  );

  return await decryptFetchedCloudBackup(encryptedBackup, password);
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

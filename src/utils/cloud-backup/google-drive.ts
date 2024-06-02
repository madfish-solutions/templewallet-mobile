/**
 * OAuth is configured through Firebase.
 * See: https://github.com/react-native-google-signin/google-signin/blob/master/docs/android-guide.md
 */
import { GoogleSignin, statusCodes, NativeModuleError } from '@react-native-google-signin/google-signin';
import { GDrive, MimeTypes } from '@robinbobin/react-native-google-drive-api-wrapper';

import { isString } from 'src/utils/is-string';

import { CLOUD_REQUEST_TIMEOUT, EncryptedBackupObject, buildAndEncryptBackup, parseBackup } from './common';

const filename = 'wallet-backup.json';

export const isCloudAvailable = async () => true;

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

    /**
     * See:
     * - https://developers.google.com/android/reference/com/google/android/gms/common/api/CommonStatusCodes
     * - https://developers.google.com/android/reference/com/google/android/gms/auth/api/signin/GoogleSignInStatusCodes
     */
    const errorCode = (error as NativeModuleError)?.code;

    if ([statusCodes.SIGN_IN_CANCELLED, '12501'].includes(String(errorCode))) {
      // Canceled by user
      return false;
    }

    throw new Error(`Failed to sign-in to Google with code: ${errorCode}`);
  }

  try {
    await buildGDrive();

    return true;
  } catch (error) {
    console.error(error);

    throw new Error('Failed to sync sign-in status');
  }
};

export const doesCloudBackupExist = () => fetchCloudBackupDetails().then(details => Boolean(details));

export const fetchCloudBackup = async (): Promise<EncryptedBackupObject | undefined> => {
  const details = await fetchCloudBackupDetails();

  if (!details) {
    return;
  }

  const gDrive = await buildGDrive();
  gDrive.fetchTimeout = CLOUD_REQUEST_TIMEOUT;

  const encryptedBackup = await gDrive.files.getText(details.id).catch(error => {
    console.error(error);

    if (error?.name === 'AbortError') {
      throw new Error('Reading cloud took too long');
    }

    throw new Error("Failed to read cloud. See if it's enabled");
  });

  return parseBackup(encryptedBackup);
};

export const saveCloudBackup = async (mnemonic: string, password: string) => {
  const encryptedData = await buildAndEncryptBackup(mnemonic, password);

  const gDrive = await buildGDrive();

  const uploader = gDrive.files
    .newMultipartUploader()
    .setRequestBody({
      name: filename,
      parents: ['appDataFolder']
    })
    .setData(encryptedData, MimeTypes.JSON);

  const details: FileDetails = await uploader.execute().catch(error => {
    console.error(error);

    throw new Error('Failed to upload to cloud');
  });

  const fileExists = await checkIfBackupExists(details.id);

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

  const gDrive = await buildGDrive();

  return await gDrive.files.getMetadata(fileId).then(
    info => {
      console.log('Backup file metadata:', info);

      return true;
    },
    error => {
      console.error(error);

      return false;
    }
  );
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
  } catch (error) {
    console.error('preLogOut() error:', { error });

    throw new Error('Failed to pre-log-out');
  }
};

interface FileDetails {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
}

const fetchCloudBackupDetails = async () => {
  const gDrive = await buildGDrive();

  const data: { files: FileDetails[]; incompleteSearch: boolean } = await gDrive.files.list({
    spaces: 'appDataFolder'
  });

  return data.files?.find(file => file.name.endsWith(filename));
};

const buildGDrive = async () => {
  const gDrive = new GDrive();

  const accessInfo = await GoogleSignin.getTokens().catch(error => {
    console.error(error);

    throw new Error('First, sign-in to Google account');
  });

  gDrive.accessToken = accessInfo.accessToken;

  return gDrive;
};

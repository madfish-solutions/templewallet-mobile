import { isIOS } from 'src/config/system';

import { EncryptedBackupObject } from './common';
import * as GoogleDriveAPI from './google-drive';
import * as ICloudAPI from './i-cloud';

export type { EncryptedBackupObject } from './common';
export { decryptCloudBackup } from './common';
export { keepRestoredCloudBackup, useRestoredCloudBackup } from './keeper';

export const cloudTitle = isIOS ? 'iCloud' : 'Google Drive';
export const FAILED_TO_LOGIN_ERR_TITLE = isIOS ? 'Failed to sync cloud' : 'Failed to log-in';

/** Keep it async for possible future needs */
export const isCloudAvailable = (): Promise<boolean> =>
  isIOS ? ICloudAPI.isCloudAvailable() : GoogleDriveAPI.isCloudAvailable();

export const requestSignInToCloud = (): Promise<boolean> =>
  isIOS ? ICloudAPI.requestSignInToCloud() : GoogleDriveAPI.requestSignInToCloud();

export const doesCloudBackupExist = (): Promise<boolean> =>
  isIOS ? ICloudAPI.doesCloudBackupExist() : GoogleDriveAPI.doesCloudBackupExist();

export const fetchCloudBackup = (): Promise<EncryptedBackupObject | undefined> =>
  isIOS ? ICloudAPI.fetchCloudBackup() : GoogleDriveAPI.fetchCloudBackup();

export const saveCloudBackup = (mnemonic: string, password: string) =>
  isIOS ? ICloudAPI.saveCloudBackup(mnemonic, password) : GoogleDriveAPI.saveCloudBackup(mnemonic, password);

export const eraseCloudBackup = () => (isIOS ? ICloudAPI.eraseCloudBackup() : GoogleDriveAPI.eraseCloudBackup());

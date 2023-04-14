import { isIOS } from 'src/config/system';

import { BackupObject } from './common';
import * as GoogleDriveAPI from './google-drive';
import * as ICloudAPI from './i-cloud';

export { cloudTitle, FAILED_TO_LOGIN_ERR_TITLE } from './common';
export { keepRestoredCloudBackup, useRestoredCloudBackup } from './keeper';

export const isCloudAvailable = (): Promise<boolean> =>
  isIOS ? ICloudAPI.isCloudAvailable() : GoogleDriveAPI.isCloudAvailable();

export const requestSignInToCloud = (): Promise<boolean> =>
  isIOS ? ICloudAPI.requestSignInToCloud() : GoogleDriveAPI.requestSignInToCloud();

export const fetchCloudBackupDetails = () =>
  isIOS ? ICloudAPI.fetchCloudBackupDetails() : GoogleDriveAPI.fetchCloudBackupDetails();

export const fetchCloudBackup = (password: string): Promise<BackupObject> =>
  isIOS ? ICloudAPI.fetchCloudBackup(password) : GoogleDriveAPI.fetchCloudBackup(password);

export const saveCloudBackup = (mnemonic: string, password: string) =>
  isIOS ? ICloudAPI.saveCloudBackup(mnemonic, password) : GoogleDriveAPI.saveCloudBackup(mnemonic, password);

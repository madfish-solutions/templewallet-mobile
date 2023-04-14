import { isAndroid, isIOS } from 'src/config/system';

import { BackupFileInterface } from './common';
import * as GoogleDriveAPI from './google-drive';
import * as ICloudAPI from './i-cloud';

export { cloudTitle, FAILED_TO_LOGIN_ERR_TITLE, saveCloudBackup } from './common';
export { keepRestoredCloudBackup, useRestoredCloudBackup } from './keeper';

export const isCloudAvailable = (): Promise<boolean> =>
  isIOS ? ICloudAPI.isCloudAvailable() : isAndroid ? GoogleDriveAPI.isCloudAvailable() : Promise.resolve(false);

export const requestSignInToCloud = (): Promise<boolean> =>
  isIOS ? ICloudAPI.requestSignInToCloud() : GoogleDriveAPI.requestSignInToCloud();

export const fetchCloudBackupDetails = () =>
  isIOS ? ICloudAPI.fetchCloudBackupDetails() : GoogleDriveAPI.fetchCloudBackupDetails();

export const fetchCloudBackup = (password: string): Promise<BackupFileInterface> =>
  isIOS ? ICloudAPI.fetchCloudBackup(password) : GoogleDriveAPI.fetchCloudBackup(password);

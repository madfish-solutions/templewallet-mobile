import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { isIOS } from 'src/config/system';

import { EncryptedBackupObject } from './common';
import * as GoogleDriveAPI from './google-drive';
import * as ICloudAPI from './i-cloud';

export type { EncryptedBackupObject } from './common';
export { decryptCloudBackup } from './common';
export { keepRestoredCloudBackup, useRestoredCloudBackup } from './keeper';

export const cloudTitle = isIOS ? 'iCloud' : 'Google Drive';
export const cloudIconName = isIOS ? IconNameEnum.Cloud : IconNameEnum.GoogleDriveNative;
export const FAILED_TO_LOGIN_ERR_TITLE = isIOS ? 'Failed to sync cloud' : 'Failed to log-in';

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

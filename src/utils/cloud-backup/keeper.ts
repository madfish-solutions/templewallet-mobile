import { isTruthy } from 'src/utils/is-truthy';

import type { BackupFileInterface } from './index';

interface KeptRestoredBackup {
  id: number;
  mnemonic: string;
  password?: string;
}

let keptBackup: KeptRestoredBackup;

export const keepRestoredCloudBackup = ({ mnemonic }: BackupFileInterface, password?: string) => {
  const id = Date.now();
  keptBackup = { id, mnemonic, password };

  return id;
};

export const getRestoredCloudBackup = (id?: number): Partial<KeptRestoredBackup> =>
  isTruthy(keptBackup) && keptBackup.id === id ? keptBackup : {};

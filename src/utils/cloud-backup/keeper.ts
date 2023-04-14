import { useMemo } from 'react';

import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';

import type { BackupObject } from './common';

interface KeptRestoredBackup {
  id: number;
  mnemonic: string;
  password?: string;
}

let keptBackup: KeptRestoredBackup | undefined;

export const keepRestoredCloudBackup = ({ mnemonic }: BackupObject, password?: string) => {
  const id = Date.now();
  keptBackup = { id, mnemonic, password };

  return id;
};

/** Once read (returned) - will be erased */
const retrieveRestoredCloudBackup = (id: number) => {
  const backup = isTruthy(keptBackup) && keptBackup.id === id ? keptBackup : null;

  if (isTruthy(backup)) {
    keptBackup = undefined;
  }

  return backup;
};

/** (!) Only available in single component mount. Once used - will be erased */
export const useRestoredCloudBackup = (id?: number): Partial<KeptRestoredBackup> =>
  useMemo(() => (isDefined(id) && retrieveRestoredCloudBackup(id)) || {}, [id]);

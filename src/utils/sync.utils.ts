import { NativeModules } from 'react-native';

import { SyncPayloadInterface } from '../interfaces/sync.interface';
import { isDefined } from './is-defined';
import { Aes } from 'react-native-aes-crypto';
import { secureCellSealWithPassphraseDecrypt64 } from 'react-native-themis';

export const TEMPLE_SYNC_PREFIX = 'templesync';

const AES_ALGORITHM: Aes.Algorithms = 'aes-256-cbc';

export const parseSyncPayload = async (payload: string, password: string): Promise<SyncPayloadInterface> => {
  let index = 0;
  const pick = (length?: number) => payload.slice(index, isDefined(length) ? (index += length) : undefined);

  const prefix = Buffer.from(pick(16), 'base64').toString('utf8');
  if (prefix !== TEMPLE_SYNC_PREFIX) {
    throw new Error('Payload is not Temple Sync payload');
  }

  const encrypted = pick();

  try {
    const context = "templewalletsync" + password;
    const decrypted = await secureCellSealWithPassphraseDecrypt64(password, encrypted, context);

    const [mnemonic, hdAccountsLength] = JSON.parse(decrypted);

    return {
      mnemonic,
      hdAccountsLength
    };
  } catch (_err) {
    throw new Error('Failed to decrypt sync payload');
  }
};

export const isSyncPayload = (payload: string): boolean => {
  if (payload.length > 64) {
    try {
      const prefix = Buffer.from(payload.slice(0, 16), 'base64').toString('utf8');

      return prefix === TEMPLE_SYNC_PREFIX;
    } catch (_err) { }
  }

  return false;
};

import { NativeModules } from 'react-native';
import { Aes } from 'react-native-aes-crypto';

import { SyncPayloadInterface } from '../interfaces/sync.interface';
import { isDefined } from './is-defined';

export const TEMPLE_SYNC_PREFIX = 'templesync';

const AES_ALGORITHM: Aes.Algorithms = 'aes-256-cbc';

export const parseSyncPayload = async (payload: string, password: string): Promise<SyncPayloadInterface> => {
  let index = 0;
  const pick = (length?: number) => payload.slice(index, isDefined(length) ? (index += length) : undefined);

  const prefix = Buffer.from(pick(16), 'base64').toString('utf8');
  if (prefix !== TEMPLE_SYNC_PREFIX) {
    throw new Error('Payload is not Temple Sync payload');
  }

  const salt = Buffer.from(pick(24), 'base64').toString('hex');
  const iv = Buffer.from(pick(24), 'base64').toString('hex');
  const encrypted = pick();

  try {
    const key = await NativeModules.Aes.pbkdf2(password, salt, 5000, 256);
    const decrypted = await NativeModules.Aes.decrypt(encrypted, key, iv, AES_ALGORITHM);

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
    } catch (_err) {}
  }

  return false;
};

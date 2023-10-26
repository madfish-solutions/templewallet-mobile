import { validateMnemonic } from 'bip39';
import { secureCellSealWithPassphraseDecrypt64 } from 'react-native-themis';

import { SyncPayloadInterface } from '../interfaces/sync.interface';

import { isDefined } from './is-defined';

export const TEMPLE_SYNC_PREFIX = 'templesync';

export const parseSyncPayload = async (payload: string, password: string): Promise<SyncPayloadInterface> => {
  let index = 0;
  const pick = (length?: number) => payload.slice(index, isDefined(length) ? (index += length) : undefined);

  const prefix = Buffer.from(pick(16), 'base64').toString('utf8');
  if (prefix !== TEMPLE_SYNC_PREFIX) {
    throw new Error('Payload is not Temple Sync payload');
  }

  const encrypted = pick();

  try {
    const decrypted = await secureCellSealWithPassphraseDecrypt64(password, encrypted);

    const [mnemonic, hdAccountsLength] = JSON.parse(decrypted);
    if (!validateMnemonic(mnemonic)) {
      throw new Error('Mnemonic not validated');
    }

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

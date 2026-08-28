import { validateMnemonic } from 'bip39';
import { secureCellSealWithPassphraseDecrypt64 } from 'react-native-themis';

import { SyncPayloadInterface } from '../interfaces/sync.interface';

import { getHdAccountsLengthForImport } from './hd-accounts.utils';
import { isDefined } from './is-defined';

export const TEMPLE_SYNC_PREFIX = 'templesync';

export const FAILED_TO_DECRYPT_ERROR = 'Wrong password. Make sure that you use the right password and try again.';
export const INVALID_SYNC_ACCOUNTS_COUNT_ERROR = 'Sync payload contains an invalid accounts count.';

export const parseSyncPayload = async (payload: string, password: string): Promise<SyncPayloadInterface> => {
  let index = 0;
  const pick = (length?: number) => payload.slice(index, isDefined(length) ? (index += length) : undefined);

  const prefix = Buffer.from(pick(16), 'base64').toString('utf8');
  if (prefix !== TEMPLE_SYNC_PREFIX) {
    throw new Error('Payload is not Temple Sync payload');
  }

  const encrypted = pick();

  let mnemonic: string;
  let hdAccountsLength: unknown;

  try {
    const decrypted = await secureCellSealWithPassphraseDecrypt64(password, encrypted);
    const parsedPayload: unknown = JSON.parse(decrypted);

    if (!Array.isArray(parsedPayload)) {
      throw new Error('Invalid sync payload');
    }

    const [parsedMnemonic, parsedHdAccountsLength] = parsedPayload;

    if (typeof parsedMnemonic !== 'string' || !validateMnemonic(parsedMnemonic)) {
      throw new Error('Mnemonic not validated');
    }

    mnemonic = parsedMnemonic;
    hdAccountsLength = parsedHdAccountsLength;
  } catch {
    throw new Error(FAILED_TO_DECRYPT_ERROR);
  }

  const accountsLengthForImport = getHdAccountsLengthForImport(hdAccountsLength);

  if (accountsLengthForImport === undefined) {
    throw new Error(INVALID_SYNC_ACCOUNTS_COUNT_ERROR);
  }

  return {
    mnemonic,
    hdAccountsLength: accountsLengthForImport
  };
};

export const isSyncPayload = (payload: string): boolean => {
  if (payload.length > 64) {
    try {
      const prefix = Buffer.from(payload.slice(0, 16), 'base64').toString('utf8');

      return prefix === TEMPLE_SYNC_PREFIX;
    } catch {}
  }

  return false;
};

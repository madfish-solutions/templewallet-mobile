import { openSecretBox } from '@stablelib/nacl';
import { ParameterValidationError } from '@taquito/core';
import { PrefixV2, b58DecodeAndCheckPrefix } from '@taquito/utils';
import pbkdf2 from 'pbkdf2';
import toBuffer from 'typedarray-to-buffer';

import { InvalidSpendingKey } from '../errors';

export function decryptKey(spendingKey: string, password?: string) {
  const [keyArr, pre] = (() => {
    try {
      return b58DecodeAndCheckPrefix(spendingKey, [PrefixV2.SaplingSpendingKey, PrefixV2.EncryptedSaplingSpendingKey]);
    } catch (err: unknown) {
      if (err instanceof ParameterValidationError) {
        throw new InvalidSpendingKey(spendingKey, 'invalid spending key');
      } else {
        throw err;
      }
    }
  })();

  if (pre === PrefixV2.EncryptedSaplingSpendingKey) {
    if (!password) {
      throw new InvalidSpendingKey(spendingKey, 'no password provided to decrypt');
    }

    const salt = toBuffer(keyArr.slice(0, 8));
    const encryptedSk = toBuffer(keyArr.slice(8));

    const encryptionKey = pbkdf2.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
    const decrypted = openSecretBox(new Uint8Array(encryptionKey), new Uint8Array(24), new Uint8Array(encryptedSk));
    if (!decrypted) {
      throw new InvalidSpendingKey(spendingKey, 'incorrect password or unable to decrypt');
    }

    return toBuffer(decrypted);
  } else {
    return toBuffer(keyArr);
  }
}

export function bufferFromNumberOfLength(value: number, minLength?: number) {
  const buffer = numberToBytes(value);

  if (minLength === undefined || minLength <= buffer.byteLength) {
    return buffer;
  }

  const leadingBuffer = Buffer.alloc(minLength - buffer.byteLength);
  leadingBuffer.fill(0);

  return Buffer.concat([leadingBuffer, buffer].map(buf => new Uint8Array(buf)));
}

function numberToBytes(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.fill(0);
  buffer.writeInt32BE(value);
  let firstNonZero = 0;
  for (let i = 0; i < buffer.byteLength; i++) {
    if (buffer[0] !== 0x00) {
      firstNonZero = i;
      break;
    }
  }

  return firstNonZero > 0 ? buffer.slice(firstNonZero) : buffer;
}

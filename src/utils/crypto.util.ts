import { entropyToMnemonic } from 'bip39';
import * as forge from 'node-forge';
import { NativeModules } from 'react-native';
import { Aes } from 'react-native-aes-crypto';
import scrypt from 'react-native-scrypt';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export const AES_ALGORITHM: Aes.Algorithms = 'aes-256-cbc';

export interface EncryptedData {
  cipher: string;
  iv: string;
}

export interface EncryptedDataSalt {
  salt: string;
}

export const generateRandomValues = (byteCount = 16) => {
  const view = new Uint8Array(byteCount);

  crypto.getRandomValues(view);

  return view;
};

const generateSalt = (): string => {
  const view = generateRandomValues(32);

  return btoa(String.fromCharCode.apply(null, Array.from(view)));
};

const scrypt$ = async (password: string, salt: string) =>
  from<string>(
    await scrypt(
      Buffer.from(password, 'base64').toString(),
      Buffer.from(salt, 'base64').toString(),
      65536,
      8,
      1,
      32,
      'base64'
    )
  );

const randomKey$ = () => from<string>(NativeModules.Aes.randomKey(16));

const encrypt$ = (value: string, key: string, iv: string) =>
  from<string>(NativeModules.Aes.encrypt(value, key, iv, AES_ALGORITHM));

export const encryptString$ = (value: string, password: string): Observable<EncryptedData & EncryptedDataSalt> => {
  const salt = generateSalt();

  return forkJoin([from(scrypt$(password, salt)).pipe(switchMap(x => x)), randomKey$()]).pipe(
    switchMap(([key, iv]) =>
      encrypt$(value, key, iv).pipe(
        map(cipher => ({
          cipher,
          iv,
          salt
        }))
      )
    )
  );
};

export const hashPassword$ = (password: string) => from(scrypt$(password, generateSalt())).pipe(switchMap(str => str));

const decrypt = async (chipher: string, password: string, salt: string) => {
  try {
    if (!password || !salt) {
      throw new Error('Missing password or salt');
    }
    const parts = chipher.split('==');
    const chiphertext = parts[0];
    const tag = parts[1];
    const key = await scrypt(Buffer.from(password), Buffer.from(salt, 'hex'), 65536, 8, 1, 32, 'buffer');
    const decipher = forge.cipher.createDecipher('AES-GCM', key.toString('binary'));
    decipher.start({
      iv: Buffer.from(salt, 'hex'),
      tag: forge.util.createBuffer(Buffer.from(tag, 'hex').toString('binary'), 'utf-8')
    });
    decipher.update(forge.util.createBuffer(Buffer.from(chiphertext, 'hex').toString('binary'), 'utf-8'));
    const pass = decipher.finish();
    if (pass === true) {
      return Buffer.from(decipher.output.toHex(), 'hex').toString();
    } else {
      return '';
    }
  } catch (err) {
    return '';
  }
};

export const decryptString$ = (
  data: EncryptedData & EncryptedDataSalt,
  password: string
): Observable<string | undefined> =>
  from(
    from(scrypt$(password, data.salt)).pipe(
      switchMap(key => key),
      map(key => decrypt(data.cipher, key, data.iv))
    )
  ).pipe(map(key => key));

export const withEncryptedPass$ = (
  keychainData: EncryptedData & EncryptedDataSalt,
  password: string
): Observable<[EncryptedData & EncryptedDataSalt, string]> =>
  hashPassword$(password).pipe(map(hash => [keychainData, hash]));

import * as forge from 'node-forge';
import scrypt from 'react-native-scrypt';
import { forkJoin, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

const generateSalt = (length = 32): string => {
  const view = generateRandomValues(length);

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

const randomKey$ = () => from<string>(generateSalt(16));

const encrypt$ = (value: string, key: string, iv: string): Observable<string> =>
  from(encrypt(value, key, iv)).pipe(switchMap(x => x));

export const encryptString$ = (value: string, password: string): Observable<EncryptedData & EncryptedDataSalt> => {
  const salt = generateSalt();

  return forkJoin([from(scrypt$(password, salt)).pipe(switchMap(x => x)), randomKey$()]).pipe(
    switchMap(([key, iv]) =>
      from(encrypt$(value, key, iv)).pipe(
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const encrypt = async (plaintext: any, password: string, salt?: string): Promise<string> => {
  if (!password) {
    throw new Error('Missing password');
  }
  let salty;
  if (salt !== undefined) {
    salty = new Buffer(salt, 'hex');
  } else {
    salty = Buffer.from(generateSalt(16), 'hex');
  }
  const key = await scrypt(Buffer.from(password), salty, 65536, 8, 1, 32, 'buffer');
  const cipher = forge.cipher.createCipher('AES-GCM', key.toString('binary'));
  cipher.start({
    iv: salty
  });
  const byteStringBuffer = forge.util.createBuffer(plaintext.toString('binary'), 'utf-8');
  cipher.update(byteStringBuffer);
  cipher.finish();
  const chiphertext = cipher.output.toHex() + '==' + cipher.mode.tag.toHex();

  // return { chiphertext: chiphertext, iv: salty.toString('hex') };
  return chiphertext;
};

export const decryptString$ = (
  data: EncryptedData & EncryptedDataSalt,
  password: string
): Observable<string | undefined> =>
  from(scrypt$(password, data.salt)).pipe(
    switchMap(key =>
      from(key).pipe(
        switchMap(actualKey => from(decrypt(data.cipher, actualKey, data.iv)).pipe(switchMap(data => data)))
      )
    )
  );
// from(scrypt$(password, data.salt)).pipe(map(key => decrypt(data.cipher, key, data.iv)));

export const withEncryptedPass$ = (
  keychainData: EncryptedData & EncryptedDataSalt,
  password: string
): Observable<[EncryptedData & EncryptedDataSalt, string]> =>
  hashPassword$(password).pipe(map(hash => [keychainData, hash]));

import scrypt from 'react-native-scrypt';
import {
  secureCellSealWithPassphraseDecrypt64,
  secureCellSealWithPassphraseEncrypt64,
  symmetricKey64
} from 'react-native-themis';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

export interface EncryptedData {
  encrypted64: string;
  salt64: string;
}

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

export const hashPassword$ = (password: string) => {
  const genSalt = async () => {
    const salt = await symmetricKey64();

    return await scrypt$(password, salt);
  };

  return from(genSalt()).pipe(switchMap(x => x));
};

export const withEncryptedPass$ = (
  keychainData: EncryptedData,
  password: string
): Observable<[EncryptedData, string]> => hashPassword$(password).pipe(map(hash => [keychainData, hash]));

export const encryptString$ = (value: string, password: string): Observable<EncryptedData> => {
  const encryption = async () => {
    const salt64 = await symmetricKey64();
    const encrypted64 = await secureCellSealWithPassphraseEncrypt64(password, value, salt64);

    return { encrypted64, salt64 };
  };

  return from(encryption());
};

export const decryptString$ = (data: EncryptedData, password: string): Observable<string | undefined> =>
  from(secureCellSealWithPassphraseDecrypt64(password, data.encrypted64, data.salt64)).pipe(
    catchError(() => of(undefined))
  );

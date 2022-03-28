import { sha256 } from 'react-native-sha256';
import {
  secureCellSealWithPassphraseDecrypt64,
  secureCellSealWithPassphraseEncrypt64,
  symmetricKey64
} from 'react-native-themis';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface EncryptedData {
  encrypted64: string;
  salt64: string;
}

export const hashPassword$ = (password: string) => from(sha256(password));

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

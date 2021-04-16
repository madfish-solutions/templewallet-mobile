import { NativeModules } from 'react-native';
import { BinaryLike } from 'crypto';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

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

const pbkdf2$ = (password: BinaryLike, salt: BinaryLike) =>
  from<string>(NativeModules.Aes.pbkdf2(password, salt, 5000, 256));

const randomKey$ = () => from<string>(NativeModules.Aes.randomKey(16));

const encrypt$ = (value: string, key: string, iv: string) => from<string>(NativeModules.Aes.encrypt(value, key, iv));

export const encryptString$ = (value: string, password: string): Observable<EncryptedData & EncryptedDataSalt> => {
  const salt = generateSalt();

  return forkJoin([pbkdf2$(password, salt), randomKey$()]).pipe(
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

export const decryptString$ = (
  data: EncryptedData & EncryptedDataSalt,
  password: string
): Observable<string | undefined> =>
  pbkdf2$(password, data.salt).pipe(
    switchMap(key =>
      from<string>(NativeModules.Aes.decrypt(data.cipher, key, data.iv)).pipe(catchError(() => of(undefined)))
    )
  );

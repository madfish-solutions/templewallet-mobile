import { BinaryLike } from 'crypto';
import { NativeModules } from 'react-native';
import { Aes } from 'react-native-aes-crypto';
import { forkJoin, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { secureSealWithPassphraseDecrypt64, secureSealWithPassphraseEncrypt64 } from 'react-native-themis';

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

const pbkdf2$ = (password: BinaryLike, salt: BinaryLike) =>
  from<string>(NativeModules.Aes.pbkdf2(password, salt, 5000, 256));

const randomKey$ = () => from<string>(NativeModules.Aes.randomKey(16));

const encrypt$ = (value: string, key: string, iv: string): Observable<string> => {
  console.log(key, value, iv);
  return from<string>(NativeModules.Aes.encrypt(value, key, iv, AES_ALGORITHM));
}

const encryptt$ = (value: string, key: string, context: string): Observable<string> => {
  // console.log("Encrypt:", value, key, context);
  return from(secureSealWithPassphraseEncrypt64(key, value, context))
};

const decryptt$ = (context: string, key: string, encrypted64: string): Observable<string> => {
  // console.log("Decrypt:", encrypted64, key, context);
  return from(secureSealWithPassphraseDecrypt64(key, encrypted64, context));
}


export const encryptString$ = (value: string, password: string): Observable<EncryptedData & EncryptedDataSalt> => {
  const salt = generateSalt();

  return from(secureSealWithPassphraseEncrypt64(password, value, salt)).pipe(
    map(cipher => ({
      cipher,
      iv: "",
      salt
    }))
  )

  // return forkJoin([pbkdf2$(password, salt), randomKey$()]).pipe(
  //   switchMap(([key, iv]) =>
  //     encryptt$(value, key, iv).pipe(
  //       map(cipher => ({
  //         cipher,
  //         iv,
  //         salt
  //       }))
  //     )
  //   )
  // );
};



export const decryptString$ = (
  data: EncryptedData & EncryptedDataSalt,
  password: string
): Observable<string | undefined> => {
  return from(secureSealWithPassphraseDecrypt64(password, data.cipher, data.salt));
}

  // pbkdf2$(password, data.salt).pipe(
  //   switchMap(key => decryptt$(data.iv, key, data.cipher))
  // );

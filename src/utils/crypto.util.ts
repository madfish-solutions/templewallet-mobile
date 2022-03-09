import { from, Observable } from 'rxjs';

import {
  symmetricKey64,
  secureCellSealWithPassphraseEncrypt64,
  secureCellSealWithPassphraseDecrypt64
} from 'react-native-themis';


export function generateRandomValues(byteCount = 32) {
  async function key() {
    const key64: string = await symmetricKey64();
    console.log("====>", key64)
    const rv = Array.from(Buffer.from(key64, 'base64'));
    console.log(rv)
    return rv;
  }
  return Promise.resolve(key());
};


export interface EncryptedData {
  encrypted64: string;
}

export interface EncryptedDataSalt {
  salt64: string;
}

export const encryptString$ = (value: string, password: string): Observable<EncryptedData & EncryptedDataSalt> => {
  function encryption(): Promise<EncryptedData & EncryptedDataSalt> {
    return new Promise((resolve) => {
      symmetricKey64().then((salt64: string) => {
        secureCellSealWithPassphraseEncrypt64(password, value, salt64)
          .then((encrypted64: string) => {
            resolve({ encrypted64, salt64 })
          })
      })
    })
  }

  return from(encryption())
};



export const decryptString$ = (
  data: EncryptedData & EncryptedDataSalt,
  password: string
): Observable<string | undefined> => {

  function decryption(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      secureCellSealWithPassphraseDecrypt64(password, data.encrypted64, data.salt64)
        .then((decrypted: string) => {
          resolve(decrypted)
        })
        .catch(() => {
          reject(undefined)
        })
    })
  }

  return from(decryption());
}

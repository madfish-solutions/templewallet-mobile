/* eslint-disable @typescript-eslint/no-explicit-any */

// import * as crypto from 'crypto';
import { NativeModules } from 'react-native';

import { isAndroid } from 'src/config/system';

const AesEncryption = NativeModules.Aes;

export class AesEncryptor {
  generateSalt(byteCount = 32) {
    const view = new Uint8Array(byteCount);

    crypto.getRandomValues(view);

    const btoa = (data: string) => Buffer.from(data).toString('base64');

    const b64encoded = btoa(
      String.fromCharCode.apply(
        null,
        // @ts-expect-error
        view
      )
    );

    return b64encoded;
  }

  generateKey = (password: any, salt: any) =>
    isAndroid ? AesEncryption.pbkdf2(password, salt, 5000, 256) : AesEncryption.pbkdf2(password, salt);

  keyFromPassword = (password: any, salt: any) => this.generateKey(password, salt);

  encryptWithKey = (text: any, keyBase64: any) => {
    const ivBase64 = this.generateSalt(32);

    return AesEncryption.encrypt(text, keyBase64, ivBase64).then((cipher: any) => ({
      cipher,
      iv: ivBase64
    }));
  };

  decryptWithKey = (encryptedData: any, key: any) => AesEncryption.decrypt(encryptedData.cipher, key, encryptedData.iv);

  encrypt = async (password: any, string: any) => {
    try {
      const salt = this.generateSalt(16);
      const key = await this.keyFromPassword(password, salt);
      const result = await this.encryptWithKey(string, key);
      result.salt = salt;

      return JSON.stringify(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  decrypt = async (password: string, encryptedString: string) => {
    try {
      const encryptedData = JSON.parse(encryptedString);
      const key = await this.keyFromPassword(password, encryptedData.salt);
      const data = await this.decryptWithKey(encryptedData, key);

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

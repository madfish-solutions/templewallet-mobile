/* eslint-disable @typescript-eslint/no-explicit-any */

// import * as crypto from 'crypto';
import { NativeModules } from 'react-native';

import { isAndroid } from 'src/config/system';

const AesEncryption = NativeModules.Aes;

export const encrypt = async (password: string, text: string) => {
  try {
    const salt = generateSalt(16);
    const key = await keyFromPassword(password, salt);
    const result = await encryptWithKey(text, key);
    result.salt = salt;

    return JSON.stringify(result);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const decrypt = async (password: string, encryptedString: string) => {
  try {
    const encryptedData = JSON.parse(encryptedString);
    const key = await keyFromPassword(password, encryptedData.salt);
    const data = await decryptWithKey(encryptedData, key);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const generateSalt = (byteCount = 32) => {
  const view = new Uint8Array(byteCount);

  crypto.getRandomValues(view);

  const b64encoded = btoa(
    String.fromCharCode.apply(
      null,
      // @ts-expect-error
      view
    )
  );

  return b64encoded;
};

const generateKey = (password: string, salt: string) =>
  isAndroid ? AesEncryption.pbkdf2(password, salt, 5000, 256) : AesEncryption.pbkdf2(password, salt);

const keyFromPassword = (password: string, salt: string) => generateKey(password, salt);

const encryptWithKey = (text: string, keyBase64: any) => {
  const ivBase64 = generateSalt(32);

  return AesEncryption.encrypt(text, keyBase64, ivBase64).then((cipher: any) => ({
    cipher,
    iv: ivBase64
  }));
};

const decryptWithKey = (encryptedData: any, key: any) =>
  AesEncryption.decrypt(encryptedData.cipher, key, encryptedData.iv);

const btoa = (data: string) => Buffer.from(data).toString('base64');

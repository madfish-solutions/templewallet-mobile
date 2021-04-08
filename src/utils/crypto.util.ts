import { NativeModules } from 'react-native';
import { BinaryLike } from 'crypto';

interface EncryptedData {
  cipher: string;
  iv: string;
}

interface EncryptedDataSalt {
  salt: string;
}

export const generateSalt = (byteCount = 32): string => {
  const view = new Uint8Array(byteCount);

  global.crypto.getRandomValues(view);

  return global.btoa(String.fromCharCode.apply(null, view));
};

export const generateKey = (password: BinaryLike, salt: BinaryLike): Promise<string> =>
  NativeModules.Aes.pbkdf2(password, salt, 5000, 256);

export const encryptString = async (str: string, password: string): Promise<EncryptedData & EncryptedDataSalt> => {
  const salt = generateSalt();
  const key = await generateKey(password, salt);

  const iv: string = await NativeModules.Aes.randomKey(16);
  const result: EncryptedData = await NativeModules.Aes.encrypt(str, key, iv).then((cipher: string) => ({
    cipher,
    iv
  }));

  return { ...result, salt };
};

export const encryptObject = async (obj: Record<string, string>, password: string) =>
  Promise.all(Object.keys(obj).map(async key => ({ [key]: await encryptString(obj[key], password) }))).then(arr =>
    arr.reduce<Record<string, EncryptedData & EncryptedDataSalt>>((prev, curr) => ({ ...prev, ...curr }), {})
  );

export const decryptString = async (data: EncryptedData & EncryptedDataSalt, password: string): Promise<string> => {
  const key = await generateKey(password, data.salt);

  return NativeModules.Aes.decrypt(data.cipher, key, data.iv);
};

export const decryptObject = async (obj: Record<string, EncryptedData & EncryptedDataSalt>, password: string) =>
  Promise.all(Object.keys(obj).map(async key => ({ [key]: await decryptString(obj[key], password) }))).then(arr =>
    arr.reduce<Record<string, string>>((prev, curr) => ({ ...prev, ...curr }), {})
  );

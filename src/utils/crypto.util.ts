import { NativeModules } from 'react-native';
import { BinaryLike } from 'crypto';

interface EncryptedData {
  cipher: string;
  iv: string;
}

interface EncryptedDataSalt {
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

const generateKey = (password: BinaryLike, salt: BinaryLike): Promise<string> =>
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
  Promise.all(Object.entries(obj).map(async ([key, value]) => [key, await encryptString(value, password)])).then(
    Object.fromEntries
  );

export const decryptString = async (data: EncryptedData & EncryptedDataSalt, password: string): Promise<string> => {
  const key = await generateKey(password, data.salt);

  return NativeModules.Aes.decrypt(data.cipher, key, data.iv);
};

export const decryptObject = async (obj: Record<string, EncryptedData & EncryptedDataSalt>, password: string) =>
  Promise.all(Object.keys(obj).map(async key => ({ [key]: await decryptString(obj[key], password) }))).then(arr =>
    arr.reduce<Record<string, string>>((prev, curr) => ({ ...prev, ...curr }), {})
  );

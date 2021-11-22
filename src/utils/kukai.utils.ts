import { entropyToMnemonic } from 'bip39';
import * as forge from 'node-forge';
import { NativeModules } from 'react-native';
import scrypt from 'react-native-scrypt';

import { isDefined } from './is-defined';

const decrypt = async (chiphertext: string, password: string, salt: string, version: number) => {
  if (version === 1) {
    return decrypt_v1(chiphertext, password, salt);
  } else if (version === 2 || version === 3) {
    return decrypt_v2(chiphertext, password, salt);
  } else {
    throw new Error('Unrecognized encryption format');
  }
};

const decrypt_v1 = async (ciphertext: string, password: string, salt: string | null) => {
  try {
    if (!isDefined(password) || !isDefined(salt)) {
      throw new Error('Missing password or salt');
    }
    const key = await NativeModules.Aes.pbkdf2(password, salt, 10000, 32, 512);
    const plaintext = await NativeModules.Aes.decryptData({ ciphertext, iv: salt }, key);

    return Buffer.from(plaintext);
  } catch (e) {
    return null;
  }
};

const decrypt_v2 = async (chipher: string, password: string, salt: string) => {
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
      return Buffer.from(decipher.output.toHex(), 'hex');
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

const bumpIV = (salt: string, bumps: number) => {
  if (bumps > 255) {
    throw new Error('Invalid incremention');
  }
  const buf = Buffer.from(salt, 'hex');
  buf[13] = (buf[13] + 1) % 256;

  return buf.toString('hex');
};

export const decryptSeedPhrase = async (json: string, pwd: string) => {
  const walletData = JSON.parse(json);
  if (
    (walletData.walletType === 4 && walletData.version === 3) ||
    (walletData.walletType === 0 && walletData.version === 3)
  ) {
    const iv = bumpIV(walletData.iv, 1);
    const entropy = await decrypt(walletData.encryptedEntropy, pwd, iv, 3);
    if (!isDefined(entropy) || (typeof entropy === 'string' && entropy === '')) {
      throw new Error('Failed to decrypt entropy. Make sure the password is correct');
    }

    return entropyToMnemonic(entropy);
  }
  throw new Error('Cannot reveal seed phrase for this wallet type');
};

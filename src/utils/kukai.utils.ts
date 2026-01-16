import { entropyToMnemonic } from 'bip39';
import * as forge from 'node-forge';
import scrypt from 'react-native-scrypt';

import { isDefined } from './is-defined';

export const KUKAI_VERSION_ERROR = 'Unsupported kukai version';

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
  } catch {
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
  if (walletData.version === 1 || walletData.version === 2) {
    throw new Error(KUKAI_VERSION_ERROR);
  }
  if (
    (walletData.walletType === 4 && walletData.version === 3) ||
    (walletData.walletType === 0 && walletData.version === 3)
  ) {
    const iv = bumpIV(walletData.iv, 1);
    const entropy = await decrypt_v2(walletData.encryptedEntropy, pwd, iv);
    if (!isDefined(entropy) || (typeof entropy === 'string' && entropy === '')) {
      throw new Error('Failed to decrypt entropy. Make sure the password is correct');
    }

    return entropyToMnemonic(entropy);
  }
  throw new Error('Cannot reveal seed phrase for this wallet type');
};

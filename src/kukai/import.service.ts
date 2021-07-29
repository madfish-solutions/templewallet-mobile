import { hd, utils } from '@tezos-core-tools/crypto-utils';

import { isDefined } from '../utils/is-defined';
import { DecryptionService } from './decryption.service';

export interface AccountCredentials {
  sk: string | null;
  pk: string | null;
  pkh: string;
  seedPhrase: string;
}

export class ImportService {
  static async getSeedPhrase(json: string, pwd: string) {
    const walletData = JSON.parse(json);
    if (
      (walletData.walletType === 4 && walletData.version === 3) ||
      (walletData.walletType === 0 && walletData.version === 3)
    ) {
      const iv = DecryptionService.bumpIV(walletData.iv, 1);
      const entropy = await DecryptionService.decrypt(walletData.encryptedEntropy, pwd, iv, 3);
      if (!isDefined(entropy) || (typeof entropy === 'string' && entropy === '')) {
        throw new Error('Failed to decrypt entropy. Make sure the password is correct');
      }

      return utils.entropyToMnemonic(entropy);
    }
    throw new Error('Cannot reveal seed phrase for this wallet type');
  }

  static async getKeys(json: string, pwd: string): Promise<AccountCredentials> {
    let seed: string | Uint8Array | Buffer | null = null;
    const walletData = JSON.parse(json);
    if (walletData.walletType === 4 && walletData.version === 3) {
      //hd
      seed = await DecryptionService.decrypt(walletData.encryptedSeed, pwd, walletData.iv, 3);
    } else if (walletData.walletType === 0) {
      if (walletData.version === 1) {
        seed = await DecryptionService.decrypt(walletData.encryptedSeed, pwd, walletData.pkh.slice(3, 19), 1);
        if (utils.seedToKeyPair(seed).pkh !== walletData.pkh) {
          seed = '';
        }
      } else if (walletData.version === 2 || walletData.version === 3) {
        seed = await DecryptionService.decrypt(walletData.encryptedSeed, pwd, walletData.iv, walletData.version);
      }
    }
    if (!isDefined(seed) || (typeof seed === 'string' && seed === '')) {
      throw new Error('Failed to decrypt seed. Make sure the password is correct');
    }
    if (seed.length === 32) {
      return utils.seedToKeyPair(seed);
    }
    if (seed.length === 64) {
      return hd.keyPairFromAccountIndex(seed, 0);
    }
    throw new Error('Failed to import account: invalid seed length');
  }
}

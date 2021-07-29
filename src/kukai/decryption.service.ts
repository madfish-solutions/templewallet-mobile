import * as AES from 'aes-js';
import * as forge from 'node-forge';
import * as pbkdf2 from 'pbkdf2';
import scrypt from 'scryptsy';

export class DecryptionService {
  static async decrypt(chiphertext: string, password: string, salt: string, version: number) {
    if (version === 1) {
      return DecryptionService.decrypt_v1(chiphertext, password, salt);
    } else if (version === 2 || version === 3) {
      return DecryptionService.decrypt_v2(chiphertext, password, salt);
    } else {
      throw new Error('Unrecognized encryption format');
    }
  }
  static async decrypt_v1(chiphertext: string, password: string, salt: string | null): Promise<Uint8Array | string> {
    return new Promise(resolve => {
      try {
        if (!password || !salt) {
          throw new Error('Missing password or salt');
        }
        pbkdf2.pbkdf2(password, salt, 10000, 32, 'sha512', (err, key) => {
          if (err) {
            throw err;
          }
          const cipherBytes = AES.utils.hex.toBytes(chiphertext);
          const aesCtr = new AES.ModeOfOperation.ctr(key);
          const plaintext = aesCtr.decrypt(cipherBytes);
          resolve(plaintext);
        });
      } catch (e) {
        resolve('');
      }
    });
  }
  static async decrypt_v2(chipher: string, password: string, salt: string): Promise<Buffer | null> {
    try {
      if (!password || !salt) {
        throw new Error('Missing password or salt');
      }
      const parts = chipher.split('==');
      const chiphertext = parts[0];
      const tag = parts[1];
      const key = await scrypt.async(password, Buffer.from(salt, 'hex'), 65536, 8, 1, 32);
      const decipher = forge.cipher.createDecipher('AES-GCM', key.toString('binary'));
      decipher.start({
        iv: Buffer.from(salt, 'hex'),
        tag: forge.util.createBuffer(Buffer.from(tag, 'hex').toString('binary'), 'utf-8')
      });
      decipher.update(forge.util.createBuffer(Buffer.from(chiphertext, 'hex').toString('binary'), 'utf-8'));
      const pass = decipher.finish();
      if (pass) {
        return Buffer.from(decipher.output.toHex(), 'hex');
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
  static bumpIV(salt: string, bumps: number) {
    if (bumps > 255) {
      throw new Error('Invalid incremention');
    }
    const buf = Buffer.from(salt, 'hex');
    buf[13] = (buf[13] + 1) % 256;

    return buf.toString('hex');
  }
}

import { b58DecodeAndCheckPrefix } from '@taquito/utils';
import { entropyToMnemonic } from 'bip39';
import bs58check from 'bs58check';

/**
 * Converts a Tezos secret key to a BIP39 mnemonic by using the raw key bytes as entropy.
 * This allows deriving deterministic sapling credentials from any account's private key.
 */
export function getMnemonicFromSecretKey(secretKey: string): string {
  let entropy: Uint8Array | Buffer;

  if (secretKey.startsWith('spsk') || secretKey.startsWith('p2sk')) {
    [entropy] = b58DecodeAndCheckPrefix(secretKey);
  } else if (secretKey.startsWith('edsk')) {
    entropy = getEntropyFromEdsk(secretKey);
  } else {
    throw new Error('Invalid secret key');
  }

  return entropyToMnemonic(Buffer.from(entropy));
}

function getEntropyFromEdsk(edskString: string) {
  const decoded = bs58check.decode(edskString);
  const prefixLength = 4;
  const rawBytes = decoded.subarray(prefixLength);

  if (rawBytes.length === 64) {
    return rawBytes.subarray(0, 32);
  }

  return rawBytes;
}

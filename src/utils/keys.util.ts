import { InMemorySigner } from '@taquito/signer';
import { b58Encode, PrefixV2 } from '@taquito/utils';
import { entropyToMnemonic } from 'bip39';
import { Buffer } from 'buffer';
import { derivePath } from 'ed25519-hd-key';
import { symmetricKey64 } from 'react-native-themis';
import { forkJoin, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { isString } from './is-string';

const TEZOS_BIP44_COINTYPE = 1729;

export const seedToPrivateKey = (seed: Buffer, derivationPath?: string) => {
  const derivedSeed = isString(derivationPath) ? deriveSeed(seed, derivationPath) : seed;

  return b58Encode(derivedSeed.slice(0, 32), PrefixV2.Ed25519Seed);
};

const deriveSeed = (seed: Buffer, derivationPath: string) => {
  try {
    const { key } = derivePath(derivationPath, seed.toString('hex'));

    return key;
  } catch {
    throw new Error('Invalid derivation path');
  }
};

export const getDerivationPath = (accountIndex: number) => `m/44'/${TEZOS_BIP44_COINTYPE}'/${accountIndex}'/0'`;

export const getPublicKeyAndHash$ = (privateKey: string) =>
  from(InMemorySigner.fromSecretKey(privateKey)).pipe(
    switchMap(signer => forkJoin([signer.publicKey(), signer.publicKeyHash()]))
  );

export const generateSeed = async () => {
  const key64 = await symmetricKey64();
  const entropy = Array.from(Buffer.from(key64, 'base64'));

  return entropyToMnemonic(Buffer.from(entropy.slice(0, 16)));
};

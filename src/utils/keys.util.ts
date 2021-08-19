import { InMemorySigner } from '@taquito/signer';
import { b58cencode, prefix } from '@taquito/utils';
import { entropyToMnemonic } from 'bip39';
import { Buffer } from 'buffer';
import { derivePath } from 'ed25519-hd-key';
import { forkJoin, from } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { generateRandomValues } from './crypto.util';
import { isString } from './is-string';

const TEZOS_BIP44_COINTYPE = 1729;

export const trimSeed = (seed: string) => seed.replace(/\n/g, ' ').trim();

export const seedToPrivateKey = (seed: Buffer, derivationPath?: string) => {
  const derivedSeed = isString(derivationPath) ? deriveSeed(seed, derivationPath) : seed;

  return b58cencode(derivedSeed.slice(0, 32), prefix.edsk2);
};

const deriveSeed = (seed: Buffer, derivationPath: string) => {
  try {
    const { key } = derivePath(derivationPath, seed.toString('hex'));

    return key;
  } catch (_err) {
    throw new Error('Invalid derivation path');
  }
};

export const getDerivationPath = (accountIndex: number) => `m/44'/${TEZOS_BIP44_COINTYPE}'/${accountIndex}'/0'`;

export const getPublicKeyAndHash$ = async (privateKey: string) => {
  console.log('getPublicKeyAndHash$')
  await InMemorySigner.fromSecretKey(privateKey)
    .then(data => console.log({ data }))
    .catch(e => console.log({ e }));

  return from(InMemorySigner.fromSecretKey(privateKey)).pipe(
    switchMap(signer => forkJoin([signer.publicKey(), signer.publicKeyHash()]))
  );
};

export const generateSeed = () => {
  const entropy = generateRandomValues();

  return entropyToMnemonic(Buffer.from(entropy));
};

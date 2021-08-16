import { InMemorySigner } from '@taquito/signer';
import { b58cencode, prefix } from '@taquito/utils';
import { entropyToMnemonic } from 'bip39';
import { Buffer } from 'buffer';
import { derivePath } from 'ed25519-hd-key';
import { forkJoin, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { showErrorToast } from '../toast/toast.utils';
import { generateRandomValues } from './crypto.util';

const TEZOS_BIP44_COINTYPE = 1729;

export const trimSeed = (seed: string) => seed.replace(/\n/g, ' ').trim();

const seedToPrivateKey = (seed: Buffer) => b58cencode(seed.slice(0, 32), prefix.edsk2);

const deriveSeed = (seed: Buffer, derivationPath: string) => {
  try {
    const { key } = derivePath(derivationPath, seed.toString('hex'));

    return key;
  } catch (_err) {
    showErrorToast({ description: 'Invalid derivation path' });
    throw new Error('Invalid derivation path');
  }
};

export const getDerivationPath = (accountIndex: number) => `m/44'/${TEZOS_BIP44_COINTYPE}'/${accountIndex}'/0'`;

export const seedToHDPrivateKey = (seed: Buffer, derivationPath: string) =>
  seedToPrivateKey(deriveSeed(seed, derivationPath));

export const getPublicKeyAndHash$ = (privateKey: string) =>
  from(InMemorySigner.fromSecretKey(privateKey)).pipe(
    switchMap(signer => forkJoin([signer.publicKey(), signer.publicKeyHash()]))
  );

export const generateSeed = () => {
  const entropy = generateRandomValues();

  return entropyToMnemonic(Buffer.from(entropy));
};

import { b58cencode, prefix } from '@taquito/utils';
import { InMemorySigner } from '@taquito/signer';
import { derivePath } from 'ed25519-hd-key';
import { entropyToMnemonic } from 'bip39';
import { Buffer } from 'buffer';
import { generateRandomValues } from './crypto.util';

const TEZOS_BIP44_COINTYPE = 1729;

export const trimSeed = (seed: string) => seed.replace(/\n/g, ' ').trim();

const seedToPrivateKey = (seed: Buffer) => b58cencode(seed.slice(0, 32), prefix.edsk2);

const deriveSeed = (seed: Buffer, derivationPath: string) => {
  try {
    const { key } = derivePath(derivationPath, seed.toString('hex'));
    return key;
  } catch (_err) {
    throw new Error('Invalid derivation path');
  }
};

const getDerivationPath = (accountIndex: number) => `m/44'/${TEZOS_BIP44_COINTYPE}'/${accountIndex}'/0'`;

export const seedToHDPrivateKey = (seed: Buffer, hdAccountIndex: number) =>
  seedToPrivateKey(deriveSeed(seed, getDerivationPath(hdAccountIndex)));

export const getPublicKeyAndHash = async (privateKey: string) => {
  const signer = await InMemorySigner.fromSecretKey(privateKey);

  return Promise.all([signer.publicKey(), signer.publicKeyHash()]);
};

export const generateSeed = () => {
  const entropy = generateRandomValues();

  return entropyToMnemonic(Buffer.from(entropy));
};

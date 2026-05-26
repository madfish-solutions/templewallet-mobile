import { InMemorySigner } from '@taquito/signer';
import { b58Encode, PrefixV2 } from '@taquito/utils';
import { entropyToMnemonic, mnemonicToSeedSync } from 'bip39';
import { Buffer } from 'buffer';
import { derivePath } from 'ed25519-hd-key';
import { symmetricKey64 } from 'react-native-themis';
import { forkJoin, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HDKey, hdKeyToAccount, mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';
import { isHex, toHex } from 'viem/utils';

import { TempleChainKind } from '../enums/temple-chain-kind.enum';

import { isString } from './is-string';

const TEZOS_BIP44_COINTYPE = 1729;
const EVM_BIP44_COINTYPE = 60;

export interface AccountCreds {
  address: string;
  publicKey: string;
  privateKey: string;
}

export interface MnemonicPrivateKey {
  chain: TempleChainKind;
  privateKey: string;
}

export const seedToPrivateKey = (seed: Buffer, derivationPath?: string) => {
  const derivedSeed = isString(derivationPath) ? deriveSeed(seed, derivationPath) : seed;

  return b58Encode(derivedSeed.subarray(0, 32), PrefixV2.Ed25519Seed);
};

const deriveSeed = (seed: Buffer, derivationPath: string) => {
  try {
    const { key } = derivePath(derivationPath, seed.toString('hex'));

    return key;
  } catch {
    throw new Error('Invalid derivation path');
  }
};

const evmPrivateKeyToHex = (privateKey: Uint8Array | nullish) => {
  if (!privateKey) {
    throw new Error('Failed to derive EVM private key');
  }

  return toHex(privateKey);
};

export const getTezosDerivationPath = (accountIndex: number) => `m/44'/${TEZOS_BIP44_COINTYPE}'/${accountIndex}'/0'`;

export const getEvmDerivationPath = (accountIndex: number) => `m/44'/${EVM_BIP44_COINTYPE}'/0'/0/${accountIndex}`;

export const isEvmDerivationPath = (path: string): path is `m/44'/${typeof EVM_BIP44_COINTYPE}'/${string}` =>
  path.startsWith(`m/44'/${EVM_BIP44_COINTYPE}'`);

export const isValidEvmDerivationPath = (path: string) => {
  if (!isEvmDerivationPath(path)) {
    return false;
  }

  try {
    hdKeyToAccount(HDKey.fromMasterSeed(new Uint8Array(64)), { path });

    return true;
  } catch {
    return false;
  }
};

export const getPublicKeyAndHash$ = (privateKey: string) =>
  from(InMemorySigner.fromSecretKey(privateKey)).pipe(
    switchMap(signer => forkJoin([signer.publicKey(), signer.publicKeyHash()]))
  );

export const privateKeyToTezosAccountCreds = async (
  privateKey: string,
  encPassword?: string
): Promise<AccountCreds> => {
  const signer = await InMemorySigner.fromSecretKey(privateKey, encPassword);
  const [realPrivateKey, publicKey, address] = await Promise.all([
    encPassword ? signer.secretKey() : Promise.resolve(privateKey),
    signer.publicKey(),
    signer.publicKeyHash()
  ]);

  return { address, publicKey, privateKey: realPrivateKey };
};

export const mnemonicToTezosAccountCreds = (
  mnemonic: string,
  hdIndex: number,
  bip39Passphrase?: string
): Promise<AccountCreds> => {
  const seed = mnemonicToSeedSync(mnemonic, bip39Passphrase);
  const privateKey = seedToPrivateKey(seed, getTezosDerivationPath(hdIndex));

  return privateKeyToTezosAccountCreds(privateKey);
};

export const mnemonicToEvmAccountCreds = (mnemonic: string, hdIndex: number): AccountCreds => {
  const account = mnemonicToAccount(mnemonic, { addressIndex: hdIndex });

  return {
    address: account.address,
    publicKey: account.publicKey,
    privateKey: evmPrivateKeyToHex(account.getHdKey().privateKey)
  };
};

export const privateKeyToEvmAccountCreds = (privateKey: string): AccountCreds => {
  if (!isHex(privateKey)) {
    throw new Error('EVM private key must be a 0x-prefixed hex value');
  }

  try {
    const account = privateKeyToAccount(privateKey);

    return {
      address: account.address,
      publicKey: account.publicKey,
      privateKey
    };
  } catch {
    throw new Error('Invalid EVM private key');
  }
};

export const mnemonicToPrivateKey = (
  mnemonic: string,
  errorFactory: (message: string) => Error,
  bip39Passphrase?: string,
  derivationPath?: string
): MnemonicPrivateKey => {
  let seed: Buffer;

  try {
    seed = mnemonicToSeedSync(mnemonic, bip39Passphrase);
  } catch {
    throw errorFactory('Invalid Mnemonic or Password');
  }

  if (!derivationPath) {
    return {
      chain: TempleChainKind.Tezos,
      privateKey: seedToPrivateKey(seed)
    };
  }

  try {
    if (isEvmDerivationPath(derivationPath)) {
      const account = hdKeyToAccount(HDKey.fromMasterSeed(new Uint8Array(seed)), { path: derivationPath });

      return {
        chain: TempleChainKind.EVM,
        privateKey: evmPrivateKeyToHex(account.getHdKey().privateKey)
      };
    }

    return {
      chain: TempleChainKind.Tezos,
      privateKey: seedToPrivateKey(seed, derivationPath)
    };
  } catch {
    throw errorFactory('Invalid derivation path');
  }
};

export const generateSeed = async () => {
  const key64 = await symmetricKey64();
  const entropy = Array.from(Buffer.from(key64, 'base64'));

  return entropyToMnemonic(Buffer.from(entropy.slice(0, 16)));
};

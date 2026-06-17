import { RawSignResult } from '@taquito/core';
import { InMemorySigner } from '@taquito/signer';
import { Signer } from '@taquito/taquito';
import { firstValueFrom } from 'rxjs';

import { TempleChainKind } from '../enums/temple-chain-kind.enum.ts';
import { Shelter } from '../shelter/shelter';
import { TezosReadOnlySignerPayload } from '../types/tezos-read-only-signer-payload';

import { READ_ONLY_SIGNER_PUBLIC_KEY, READ_ONLY_SIGNER_PUBLIC_KEY_HASH } from './env.utils';

export class TezosReadOnlySigner implements Signer {
  constructor(private pkh: string, private pk: string) {}

  async publicKeyHash() {
    return this.pkh;
  }
  async publicKey() {
    return this.pk;
  }
  async secretKey(): Promise<string> {
    throw new Error('Secret key cannot be exposed');
  }
  async sign(): Promise<{
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
  }> {
    throw new Error('Cannot sign');
  }

  async provePossession(): Promise<RawSignResult> {
    if (!this.pkh.startsWith('tz4')) {
      throw new Error('Only BLS keys can prove possession');
    }

    const realSigner: InMemorySigner = await firstValueFrom(Shelter.getTezosSigner$(this.pkh));

    return realSigner.provePossession();
  }
}

export const tezosReadOnlySignerAccount: TezosReadOnlySignerPayload = {
  chain: TempleChainKind.Tezos,
  publicKey: READ_ONLY_SIGNER_PUBLIC_KEY,
  address: READ_ONLY_SIGNER_PUBLIC_KEY_HASH
};

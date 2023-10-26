import { Signer } from '@taquito/taquito';

import { AccountTypeEnum } from '../enums/account-type.enum';
import { AccountInterface } from '../interfaces/account.interface';

import { READ_ONLY_SIGNER_PUBLIC_KEY, READ_ONLY_SIGNER_PUBLIC_KEY_HASH } from './env.utils';

export class ReadOnlySigner implements Signer {
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
}

export const readOnlySignerAccount: AccountInterface = {
  name: 'Read-only account',
  type: AccountTypeEnum.IMPORTED_ACCOUNT,
  publicKey: READ_ONLY_SIGNER_PUBLIC_KEY,
  publicKeyHash: READ_ONLY_SIGNER_PUBLIC_KEY_HASH
};

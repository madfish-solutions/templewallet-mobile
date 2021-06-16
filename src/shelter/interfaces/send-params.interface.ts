import { WalletParamsWithKind } from '@taquito/taquito';

export interface SendParams {
  publicKeyHash: string;
  opParams: WalletParamsWithKind[];
}

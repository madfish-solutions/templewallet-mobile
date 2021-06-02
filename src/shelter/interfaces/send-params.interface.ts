import { WalletParamsWithKind } from '@taquito/taquito';

export interface SendParams {
  from: string;
  params: WalletParamsWithKind | WalletParamsWithKind[];
}

import { WalletParamsWithKind } from '@taquito/taquito';

export interface SendInterface {
  from: string;
  params: WalletParamsWithKind | WalletParamsWithKind[];
}

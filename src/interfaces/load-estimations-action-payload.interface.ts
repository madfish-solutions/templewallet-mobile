import { WalletParamsWithKind } from '@taquito/taquito';

import { WalletAccountInterface } from './wallet-account.interface';

export interface LoadEstimationsActionPayloadInterface {
  sender: WalletAccountInterface;
  opParams: WalletParamsWithKind[];
}

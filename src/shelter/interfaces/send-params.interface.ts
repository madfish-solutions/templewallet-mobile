import { WalletParamsWithKind } from '@taquito/taquito';

import { EventFn } from '../../config/general';

export interface SendParams {
  publicKeyHash: string;
  opParams: WalletParamsWithKind[];
  successCallback: EventFn<string>;
}

import { ParamsWithKind } from '@taquito/taquito';

import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';

export interface ApproveInternalOperationRequestActionPayloadInterface {
  rpcUrl: string;
  sender: WalletAccountInterface;
  opParams: ParamsWithKind[];
}

import { OperationRequestOutput } from '@airgap/beacon-sdk';
import { ParamsWithKind } from '@taquito/taquito';

import { TempleChainKind } from '../../enums/temple-chain-kind.enum.ts';
import { AccountForChain } from '../../utils/account.utils.ts';

export interface ApproveOperationRequestActionPayloadInterface {
  rpcUrl: string;
  sender: AccountForChain<TempleChainKind.Tezos>;
  opParams: ParamsWithKind[];
  message: OperationRequestOutput;
}

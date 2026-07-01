import { OperationRequestOutput } from '@airgap/beacon-sdk';
import { ParamsWithKind } from '@taquito/taquito';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum.ts';
import { AccountForChain } from 'src/utils/account.utils.ts';

export interface ApproveOperationRequestActionPayloadInterface {
  sender: AccountForChain<TempleChainKind.Tezos>;
  opParams: ParamsWithKind[];
  message: OperationRequestOutput;
}

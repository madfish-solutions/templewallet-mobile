import { OperationRequestOutput } from '@airgap/beacon-sdk';

export interface ApproveOperationRequestActionPayloadInterface {
  message: OperationRequestOutput;
  transactionHash: string;
}

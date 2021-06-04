import { OpKind } from '@taquito/taquito';

export interface OperationErrorPayload {
  error: string;
  opHash: string;
  type: 'batch' | OpKind.ORIGINATION | OpKind.DELEGATION | OpKind.TRANSACTION;
}

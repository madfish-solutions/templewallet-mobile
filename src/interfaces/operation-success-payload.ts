import { OpKind } from '@taquito/taquito';

export interface OperationSuccessPayload {
  opHash: string;
  type: 'batch' | OpKind.ORIGINATION | OpKind.DELEGATION | OpKind.TRANSACTION;
}

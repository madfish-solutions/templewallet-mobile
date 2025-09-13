import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';

export const mockDelegationParams: ParamsWithKind = {
  kind: OpKind.DELEGATION,
  source: 'address1',
  delegate: 'delegate1'
};

export const mockTezosTransferParams: ParamsWithKind = {
  kind: OpKind.TRANSACTION,
  to: 'address2',
  amount: 10
};

export const mockFA1_2TokenTransferParams: ParamsWithKind = {
  kind: OpKind.TRANSACTION,
  to: 'fa12TokenAddress',
  amount: 0,
  parameter: {
    entrypoint: 'transfer',
    value: {
      prim: 'Pair',
      args: [{ string: 'address1' }, { prim: 'Pair', args: [{ string: 'address2' }, { int: '20' }] }]
    }
  }
};

export const mockFA_2TokenTransferParams: ParamsWithKind = {
  kind: OpKind.TRANSACTION,
  to: 'fa2TokenAddress',
  amount: 0,
  parameter: {
    entrypoint: 'transfer',
    value: [
      {
        prim: 'Pair',
        args: [
          { string: 'address1' },
          [
            {
              prim: 'Pair',
              args: [{ string: 'address2' }, { prim: 'Pair', args: [{ int: '10' }, { int: '1000' }] }]
            }
          ]
        ]
      }
    ]
  }
};

export const mockFA1_2ApproveParams: ParamsWithKind = {
  kind: OpKind.TRANSACTION,
  to: 'fa12TokenAddress',
  amount: 0,
  parameter: {
    entrypoint: 'approve',
    value: {
      prim: 'Pair',
      args: [
        {
          string: 'contractAddress1'
        },
        {
          int: '20'
        }
      ]
    }
  }
};

export const mockContractCallParams: ParamsWithKind = {
  kind: OpKind.TRANSACTION,
  to: 'contractAddress1',
  amount: 0,
  parameter: {
    entrypoint: 'foo',
    value: { int: '8' }
  }
};

export const mockOriginationParams: ParamsWithKind = {
  kind: OpKind.ORIGINATION,
  code: 'mockCode',
  init: 'mockInit'
};

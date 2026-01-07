import { TezosOperationType } from '@airgap/beacon-sdk';

import { SemiPartialTezosOperation } from './semi-partial-tezos-operation';

export const mockOriginationOperation: SemiPartialTezosOperation = {
  kind: TezosOperationType.ORIGINATION,
  balance: '0',
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  script: { code: 'mockCode', storage: 'mockStorage' } as any,
  fee: '1',
  gas_limit: '2',
  storage_limit: '3',
  source: 'account1',
  counter: '100000'
};

export const mockTransactionOperation: SemiPartialTezosOperation = {
  kind: TezosOperationType.TRANSACTION,
  amount: '0',
  destination: 'account1',
  fee: '1',
  gas_limit: '2',
  storage_limit: '3',
  source: 'account1',
  counter: '100000',
  parameters: {
    entrypoint: 'mockEntrypoint',
    value: { int: '3' }
  }
};

export const mockOtherTypesOperations: SemiPartialTezosOperation[] = [
  {
    kind: TezosOperationType.ACTIVATE_ACCOUNT,
    pkh: 'account1',
    secret: 'mockSecret',
    fee: '1',
    gas_limit: '2',
    storage_limit: '3'
  },
  {
    kind: TezosOperationType.BALLOT,
    source: 'account1',
    period: 4,
    proposal: 'mockProposal',
    ballot: 'yay',
    fee: '1',
    gas_limit: '2',
    storage_limit: '3'
  },
  {
    kind: TezosOperationType.DELEGATION,
    delegate: 'mockDelegate',
    fee: '1',
    gas_limit: '2',
    storage_limit: '3'
  },
  {
    kind: TezosOperationType.ENDORSEMENT,
    level: '666',
    fee: '1',
    gas_limit: '2',
    storage_limit: '3'
  },
  {
    kind: TezosOperationType.PROPOSALS,
    source: 'account1',
    period: '4',
    proposals: ['mockProposal'],
    fee: '1',
    gas_limit: '2',
    storage_limit: '3'
  },
  {
    kind: TezosOperationType.REVEAL,
    public_key: 'mockPublicKey',
    fee: '1',
    gas_limit: '2',
    storage_limit: '3'
  },
  {
    kind: TezosOperationType.SEED_NONCE_REVELATION,
    level: 666,
    nonce: '667'
  }
];

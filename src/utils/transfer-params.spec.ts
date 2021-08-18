import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { mockWalletAccount } from '../interfaces/wallet-account.interface.mock';
import { mockFA1_2Contract, mockFA2Contract, mockToolkitMethods } from '../mocks/tezos.mock';
import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { mockFA1_2TokenMetadata, mockFA2TokenMetadata } from '../token/interfaces/token-metadata.interface.mock';
import { rxJsTestingHelper } from './testing.utis';
import { getTransferParams$ } from './transfer-params.utils';

beforeEach(() => {
  mockFA1_2Contract.methods.transfer.mockReset();
  mockFA2Contract.methods.transfer.mockReset();
});

const mockTezosToolkit = new TezosToolkit('mockRpcUrl');

it('getTransferParams$ should create params for transferring TEZ', done => {
  getTransferParams$(
    TEZ_TOKEN_METADATA,
    mockWalletAccount,
    'receiverPublicKeyHash',
    new BigNumber(0.005),
    mockTezosToolkit
  ).subscribe(
    rxJsTestingHelper(params => {
      expect(params).toEqual({ amount: 5000, to: 'receiverPublicKeyHash', mutez: true });
    }, done)
  );
});

it('getTransferParams$ should create params for transferring FA1.2 tokens', done => {
  mockFA1_2Contract.methods.transfer.mockReturnValueOnce({ toTransferParams: jest.fn(), send: jest.fn() });
  mockToolkitMethods.contractAt.mockResolvedValueOnce(mockFA1_2Contract);
  getTransferParams$(
    mockFA1_2TokenMetadata,
    mockWalletAccount,
    'receiverPublicKeyHash',
    new BigNumber(0.01),
    mockTezosToolkit
  ).subscribe(
    rxJsTestingHelper(() => {
      expect(mockFA1_2Contract.methods.transfer).toBeCalledWith(
        mockWalletAccount.publicKeyHash,
        'receiverPublicKeyHash',
        '10000'
      );
    }, done)
  );
});

it('getTransferParams$ should create params for transferring FA2 tokens', done => {
  mockFA2Contract.methods.transfer.mockReturnValueOnce({ toTransferParams: jest.fn(), send: jest.fn() });
  mockToolkitMethods.contractAt.mockResolvedValueOnce(mockFA2Contract);
  getTransferParams$(
    mockFA2TokenMetadata,
    mockWalletAccount,
    'receiverPublicKeyHash',
    new BigNumber(0.001),
    mockTezosToolkit
  ).subscribe(
    rxJsTestingHelper(() => {
      expect(mockFA2Contract.methods.transfer).toBeCalledWith([
        {
          from_: mockWalletAccount.publicKeyHash,
          txs: [
            {
              to_: 'receiverPublicKeyHash',
              token_id: mockFA2TokenMetadata.id,
              amount: '100000'
            }
          ]
        }
      ]);
    }, done)
  );
});

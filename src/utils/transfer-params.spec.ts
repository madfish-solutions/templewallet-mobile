import { BigNumber } from 'bignumber.js';

import { mockHdAccount } from '../interfaces/account.interface.mock';
import { mockFA1_2Contract, mockFA2Contract, mockToolkitMethods } from '../mocks/tezos.mock';
import { FILM_TOKEN_METADATA, TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { mockFA1_2TokenMetadata, mockFA2TokenMetadata } from '../token/interfaces/token-metadata.interface.mock';

import { rxJsTestingHelper } from './testing.utis';
import { getTransferParams$ } from './transfer-params.utils';

const mockRpcUrl = 'https://rpc-url.mock/mainnet';

describe('getTransferParams$', () => {
  beforeEach(() => {
    mockFA1_2Contract.methods.transfer.mockReset();
    mockFA2Contract.methods.transfer.mockReset();
  });

  it('should create params for transferring TEZ', done => {
    const mockInputAmount = new BigNumber(0.005);

    getTransferParams$(
      TEZ_TOKEN_METADATA,
      mockRpcUrl,
      mockHdAccount,
      'receiverPublicKeyHash',
      mockInputAmount
    ).subscribe(
      rxJsTestingHelper(params => {
        expect(params).toEqual({ amount: mockInputAmount.toNumber(), to: 'receiverPublicKeyHash', mutez: true });
      }, done)
    );
  });

  it('should create params for transferring FILM', done => {
    const mockInputAmount = new BigNumber(0.005);

    getTransferParams$(
      FILM_TOKEN_METADATA,
      mockRpcUrl,
      mockHdAccount,
      'receiverPublicKeyHash',
      mockInputAmount
    ).subscribe(
      rxJsTestingHelper(params => {
        expect(params).toEqual({ amount: mockInputAmount.toNumber(), to: 'receiverPublicKeyHash', mutez: true });
      }, done)
    );
  });

  it('should create params for transferring FA1.2 tokens', done => {
    mockFA1_2Contract.methods.transfer.mockReturnValueOnce({ toTransferParams: jest.fn(), send: jest.fn() });
    mockToolkitMethods.contractAt.mockResolvedValueOnce(mockFA1_2Contract);

    const mockInputAmount = new BigNumber(0.01);

    getTransferParams$(
      mockFA1_2TokenMetadata,
      mockRpcUrl,
      mockHdAccount,
      'receiverPublicKeyHash',
      mockInputAmount
    ).subscribe(
      rxJsTestingHelper(() => {
        expect(mockFA1_2Contract.methods.transfer).toBeCalledWith(
          mockHdAccount.publicKeyHash,
          'receiverPublicKeyHash',
          mockInputAmount
        );
      }, done)
    );
  });

  it('should create params for transferring FA2 tokens', done => {
    mockFA2Contract.methods.transfer.mockReturnValueOnce({ toTransferParams: jest.fn(), send: jest.fn() });
    mockToolkitMethods.contractAt.mockResolvedValueOnce(mockFA2Contract);

    const mockInputAmount = new BigNumber(0.001);

    getTransferParams$(
      mockFA2TokenMetadata,
      mockRpcUrl,
      mockHdAccount,
      'receiverPublicKeyHash',
      mockInputAmount
    ).subscribe(
      rxJsTestingHelper(params => {
        expect(params).toEqual({
          to: mockFA2Contract.address,
          amount: 0,
          parameter: {
            entrypoint: 'transfer',
            value: [
              {
                prim: 'Pair',
                args: [
                  { string: mockHdAccount.publicKeyHash },
                  [
                    {
                      prim: 'Pair',
                      args: [
                        { string: 'receiverPublicKeyHash' },
                        {
                          prim: 'Pair',
                          args: [
                            { int: new BigNumber(mockFA2TokenMetadata.id).toFixed() },
                            { int: mockInputAmount.toFixed() }
                          ]
                        }
                      ]
                    }
                  ]
                ]
              }
            ]
          }
        });
      }, done)
    );
  });
});

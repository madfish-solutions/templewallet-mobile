import { AccessList, SignedAuthorization } from 'viem';

import { estimateEvmTransaction } from './estimate-evm-transaction';

const ACCOUNT: HexString = '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826';
const TO: HexString = '0x0000000000000000000000000000000000000001';
const ACCESS_LIST: AccessList = [{ address: TO, storageKeys: ['0x00'] }];
const AUTHORIZATION_LIST: SignedAuthorization[] = [
  {
    address: TO,
    chainId: 1,
    nonce: 1,
    r: '0x1111111111111111111111111111111111111111111111111111111111111111',
    s: '0x2222222222222222222222222222222222222222222222222222222222222222',
    yParity: 0
  }
];

describe('estimateEvmTransaction', () => {
  it('forwards EIP-2930 type and accessList, and maps prepared fees as legacy', async () => {
    const prepareTransactionRequest = jest.fn().mockResolvedValue({
      type: 'eip2930',
      gas: 21_000n,
      gasPrice: 10n
    });

    await expect(
      estimateEvmTransaction({ prepareTransactionRequest }, ACCOUNT, {
        to: TO,
        value: 0n,
        type: 'eip2930',
        accessList: ACCESS_LIST,
        gas: 1n,
        gasPrice: 99n
      })
    ).resolves.toEqual({
      type: 'legacy',
      gas: 21_000n,
      gasPrice: 10n,
      estimatedFee: 210_000n
    });

    expect(prepareTransactionRequest).toHaveBeenCalledWith({
      account: ACCOUNT,
      to: TO,
      value: 0n,
      data: undefined,
      type: 'eip2930',
      accessList: ACCESS_LIST
    });
  });

  it('forwards EIP-7702 type and authorizationList, and maps prepared fees as EIP-1559', async () => {
    const prepareTransactionRequest = jest.fn().mockResolvedValue({
      type: 'eip7702',
      gas: 21_000n,
      maxFeePerGas: 10n,
      maxPriorityFeePerGas: 1n
    });

    await expect(
      estimateEvmTransaction({ prepareTransactionRequest }, ACCOUNT, {
        to: TO,
        value: 0n,
        type: 'eip7702',
        authorizationList: AUTHORIZATION_LIST,
        gas: 1n,
        maxFeePerGas: 99n,
        maxPriorityFeePerGas: 50n
      })
    ).resolves.toEqual({
      type: 'eip1559',
      gas: 21_000n,
      maxFeePerGas: 10n,
      maxPriorityFeePerGas: 1n,
      estimatedFee: 210_000n
    });

    expect(prepareTransactionRequest).toHaveBeenCalledWith({
      account: ACCOUNT,
      to: TO,
      value: 0n,
      data: undefined,
      type: 'eip7702',
      authorizationList: AUTHORIZATION_LIST
    });
  });
});

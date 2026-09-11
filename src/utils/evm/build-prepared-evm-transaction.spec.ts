import { AccessList, SignedAuthorization } from 'viem';

import { buildPreparedEvmTransaction } from './build-prepared-evm-transaction';

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

describe('buildPreparedEvmTransaction', () => {
  it('keeps EIP-2930 type and accessList with wallet gasPrice', () => {
    expect(
      buildPreparedEvmTransaction(
        {
          to: TO,
          value: 0n,
          type: 'eip2930',
          accessList: ACCESS_LIST
        },
        { gasLimit: 21_000n, fees: { type: 'legacy', gasPrice: 10n } }
      )
    ).toEqual({
      to: TO,
      value: 0n,
      data: undefined,
      nonce: undefined,
      gas: 21_000n,
      accessList: ACCESS_LIST,
      type: 'eip2930',
      gasPrice: 10n
    });
  });

  it('keeps EIP-7702 type and authorizationList with wallet EIP-1559 fees', () => {
    expect(
      buildPreparedEvmTransaction(
        {
          to: TO,
          value: 0n,
          type: 'eip7702',
          authorizationList: AUTHORIZATION_LIST
        },
        {
          gasLimit: 21_000n,
          fees: { type: 'eip1559', maxFeePerGas: 10n, maxPriorityFeePerGas: 1n }
        }
      )
    ).toEqual({
      to: TO,
      value: 0n,
      data: undefined,
      nonce: undefined,
      gas: 21_000n,
      type: 'eip7702',
      authorizationList: AUTHORIZATION_LIST,
      maxFeePerGas: 10n,
      maxPriorityFeePerGas: 1n
    });
  });
});

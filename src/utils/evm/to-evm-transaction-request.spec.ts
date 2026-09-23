import { parseRpcTransactionRequest } from './parse-rpc-transaction-request';
import { toEvmTransactionRequest } from './to-evm-transaction-request';
import { validateSendTransactionParams } from './validation-schemas';

const ADDRESS: HexString = '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826';

describe('toEvmTransactionRequest', () => {
  it('forwards EIP-2930 type and accessList', () => {
    const [tx] = validateSendTransactionParams([
      {
        from: ADDRESS,
        to: ADDRESS,
        value: '0x0',
        gasLimit: '0x5208',
        gasPrice: '0x2540be400',
        type: '0x1',
        accessList: [{ address: ADDRESS, storageKeys: ['0x00'] }]
      }
    ]);

    expect(toEvmTransactionRequest(parseRpcTransactionRequest(tx))).toMatchObject({
      type: 'eip2930',
      gas: 21000n,
      gasPrice: 10_000_000_000n,
      accessList: [{ address: ADDRESS, storageKeys: ['0x00'] }]
    });
  });

  it('forwards EIP-7702 type and authorizationList', () => {
    const [tx] = validateSendTransactionParams([
      {
        from: ADDRESS,
        to: ADDRESS,
        value: '0x0',
        gasLimit: '0x5208',
        maxFeePerGas: '0x2540be400',
        maxPriorityFeePerGas: '0x3b9aca00',
        type: '0x4',
        authorizationList: [
          {
            address: ADDRESS,
            chainId: '0xa7f9',
            nonce: '0x1',
            yParity: '0x0',
            r: '0x1111111111111111111111111111111111111111111111111111111111111111',
            s: '0x2222222222222222222222222222222222222222222222222222222222222222'
          }
        ]
      }
    ]);

    expect(toEvmTransactionRequest(parseRpcTransactionRequest(tx))).toMatchObject({
      type: 'eip7702',
      gas: 21000n,
      maxFeePerGas: 10_000_000_000n,
      maxPriorityFeePerGas: 1_000_000_000n,
      authorizationList: [
        {
          address: ADDRESS,
          chainId: 0xa7f9,
          nonce: 1,
          yParity: 0
        }
      ]
    });
  });
});

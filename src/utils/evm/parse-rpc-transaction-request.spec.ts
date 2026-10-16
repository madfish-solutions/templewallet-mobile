import { parseRpcTransactionRequest } from './parse-rpc-transaction-request';
import { validateSendTransactionParams } from './validation-schemas';

const ADDRESS = '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826';
const TEN_GWEI = 10_000_000_000n;

describe('parseRpcTransactionRequest', () => {
  it('keeps legacy gasPrice from the MetaMask test dapp payload', () => {
    const [tx] = validateSendTransactionParams([
      {
        from: ADDRESS,
        to: ADDRESS,
        value: '0x0',
        gasLimit: '0x5208',
        gasPrice: '0x2540be400',
        type: '0x0'
      }
    ]);

    expect(parseRpcTransactionRequest(tx)).toMatchObject({
      type: 'legacy',
      gas: 21000n,
      gasPrice: TEN_GWEI
    });
  });

  it('does not drop gasPrice when type is 0x2 without EIP-1559 fee fields', () => {
    const [tx] = validateSendTransactionParams([
      {
        from: ADDRESS,
        to: ADDRESS,
        value: '0x0',
        gasLimit: '0x5208',
        gasPrice: '0x2540be400',
        type: '0x2'
      }
    ]);

    expect(parseRpcTransactionRequest(tx)).toMatchObject({
      type: 'legacy',
      gasPrice: TEN_GWEI
    });
  });

  it('keeps EIP-1559 maxFeePerGas from the MetaMask test dapp payload', () => {
    const [tx] = validateSendTransactionParams([
      {
        from: ADDRESS,
        to: ADDRESS,
        value: '0x0',
        gasLimit: '0x5208',
        maxFeePerGas: '0x2540be400',
        maxPriorityFeePerGas: '0x3b9aca00'
      }
    ]);

    expect(parseRpcTransactionRequest(tx)).toMatchObject({
      type: 'eip1559',
      maxFeePerGas: TEN_GWEI,
      maxPriorityFeePerGas: 1_000_000_000n
    });
  });

  it('forwards EIP-2930 accessList with legacy gasPrice', () => {
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

    expect(parseRpcTransactionRequest(tx)).toMatchObject({
      type: 'eip2930',
      gasPrice: TEN_GWEI,
      accessList: [{ address: ADDRESS, storageKeys: ['0x00'] }]
    });
  });

  it('forwards EIP-7702 authorizationList with EIP-1559 fees', () => {
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

    expect(parseRpcTransactionRequest(tx)).toMatchObject({
      type: 'eip7702',
      maxFeePerGas: TEN_GWEI,
      maxPriorityFeePerGas: 1_000_000_000n,
      authorizationList: [
        {
          address: ADDRESS,
          chainId: 0xa7f9,
          nonce: 1,
          yParity: 0,
          r: '0x1111111111111111111111111111111111111111111111111111111111111111',
          s: '0x2222222222222222222222222222222222222222222222222222222222222222'
        }
      ]
    });
  });
});

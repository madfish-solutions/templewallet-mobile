import {
  validatePersonalSignParams,
  validateSendTransactionParams,
  validateSignTypedDataParams,
  validateWatchAssetParams
} from './index';

const ADDRESS = '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826';

describe('evm rpc validation schemas', () => {
  it('validates personal_sign hex params and checksums the address', () => {
    const [message, address] = validatePersonalSignParams(['0x6869', ADDRESS.toLowerCase()]);

    expect(message).toBe('0x6869');
    expect(address).toBe(ADDRESS);
  });

  it('rejects non-hex personal_sign messages', () => {
    expect(() => validatePersonalSignParams(['hello', ADDRESS])).toThrow(/hex|Invalid/i);
  });

  it('validates untyped eth_sendTransaction params', () => {
    const [tx] = validateSendTransactionParams([
      {
        from: ADDRESS,
        to: ADDRESS,
        value: '0x1',
        gas: '0x5208'
      }
    ]);

    expect(tx.from).toBe(ADDRESS);
    expect(tx.value).toBe('0x1');
  });

  it('rejects mixed fee models on untyped transactions', () => {
    expect(() =>
      validateSendTransactionParams([
        {
          from: ADDRESS,
          to: ADDRESS,
          gasPrice: '0x1',
          maxFeePerGas: '0x1'
        }
      ])
    ).toThrow(/fee/i);
  });

  it('parses JSON-string typed data for eth_signTypedData_v4', () => {
    const typedData = {
      types: {
        EIP712Domain: [{ name: 'name', type: 'string' }],
        Mail: [{ name: 'contents', type: 'string' }]
      },
      primaryType: 'Mail',
      domain: { name: 'Example' },
      message: { contents: 'hi' }
    };

    const [address, parsed] = validateSignTypedDataParams([ADDRESS, JSON.stringify(typedData)]);

    expect(address).toBe(ADDRESS);
    expect(parsed.primaryType).toBe('Mail');
  });

  it('validates wallet_watchAsset object and array params', () => {
    const body = {
      type: 'ERC20',
      options: {
        address: ADDRESS.toLowerCase(),
        symbol: 'TKN',
        decimals: 18,
        image: 'https://example.com/token.png'
      }
    };

    expect(validateWatchAssetParams(body)).toMatchObject({
      type: 'ERC20',
      options: { address: ADDRESS, symbol: 'TKN', decimals: 18 }
    });
    expect(validateWatchAssetParams([body]).options.address).toBe(ADDRESS);
  });

  it('rejects unsupported wallet_watchAsset types', () => {
    expect(() =>
      validateWatchAssetParams({
        type: 'ERC721',
        options: { address: ADDRESS }
      })
    ).toThrow();
  });
});

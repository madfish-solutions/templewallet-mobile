import { estimateEvmTransaction } from './estimate-evm-transaction';

const account = '0x1111111111111111111111111111111111111111';
const recipient = '0x2222222222222222222222222222222222222222';

describe('estimateEvmTransaction', () => {
  it('returns a complete EIP-1559 fee estimate when selected by the network', async () => {
    const prepareTransactionRequest = jest.fn().mockResolvedValue({
      type: 'eip1559',
      gas: 21_000n,
      maxFeePerGas: 100n,
      maxPriorityFeePerGas: 10n
    });
    const publicClient = { prepareTransactionRequest };

    await expect(estimateEvmTransaction(publicClient, account, { to: recipient, value: 42n })).resolves.toEqual({
      type: 'eip1559',
      gas: 21_000n,
      maxFeePerGas: 100n,
      maxPriorityFeePerGas: 10n,
      estimatedFee: 2_100_000n
    });
    expect(prepareTransactionRequest).toHaveBeenCalledWith({ account, to: recipient, value: 42n });
  });

  it('returns a complete legacy fee estimate when selected by the network', async () => {
    const publicClient = {
      prepareTransactionRequest: jest.fn().mockResolvedValue({ type: 'legacy', gas: 21_000n, gasPrice: 100n })
    };

    await expect(estimateEvmTransaction(publicClient, account, { to: recipient, value: 42n })).resolves.toEqual({
      type: 'legacy',
      gas: 21_000n,
      gasPrice: 100n,
      estimatedFee: 2_100_000n
    });
  });

  it('rejects unsupported prepared transaction types', async () => {
    const publicClient = {
      prepareTransactionRequest: jest.fn().mockResolvedValue({ type: 'eip2930', gas: 21_000n, gasPrice: 100n })
    };

    await expect(estimateEvmTransaction(publicClient, account, { to: recipient, value: 0n })).rejects.toThrow(
      'Unsupported EVM transaction type: eip2930'
    );
  });

  it('rejects an invalid EIP-1559 fee pair returned by the RPC', async () => {
    const publicClient = {
      prepareTransactionRequest: jest.fn().mockResolvedValue({
        type: 'eip1559',
        gas: 21_000n,
        maxFeePerGas: 10n,
        maxPriorityFeePerGas: 11n
      })
    };

    await expect(estimateEvmTransaction(publicClient, account, { to: recipient, value: 0n })).rejects.toThrow(
      'Invalid EIP-1559 fee estimation'
    );
  });

  it('rejects an invalid legacy gas price returned by the RPC', async () => {
    const publicClient = {
      prepareTransactionRequest: jest.fn().mockResolvedValue({ type: 'legacy', gas: 21_000n, gasPrice: 0n })
    };

    await expect(estimateEvmTransaction(publicClient, account, { to: recipient, value: 0n })).rejects.toThrow(
      'Invalid legacy fee estimation'
    );
  });
});

import { BaseError, FeeCapTooLowError, InsufficientFundsError, NonceTooLowError } from 'viem';

import { normalizeEvmTransactionError } from './evm-transaction-error';

describe('normalizeEvmTransactionError', () => {
  it.each([
    [new InsufficientFundsError(), 'insufficient-native-balance'],
    [new FeeCapTooLowError(), 'fee-too-low'],
    [new NonceTooLowError({ nonce: 1 }), 'nonce-too-low']
  ] as const)('maps %s to %s', (error, code) => {
    expect(normalizeEvmTransactionError(error).code).toBe(code);
  });

  it('maps token balance and approval reverts', () => {
    expect(normalizeEvmTransactionError(new Error('ERC20: transfer amount exceeds balance')).code).toBe(
      'insufficient-asset-balance'
    );
    expect(normalizeEvmTransactionError(new Error('ERC20: insufficient allowance')).code).toBe('not-approved');
  });

  it('uses a concise revert reason when one is available', () => {
    const error = new BaseError('Execution reverted', { details: 'The contract is paused' });

    expect(normalizeEvmTransactionError(error)).toMatchObject({
      code: 'execution-reverted',
      message: 'The contract is paused'
    });
  });

  it('does not expose an unknown raw RPC error to the user', () => {
    expect(normalizeEvmTransactionError(new Error('sensitive rpc response')).message).toBe(
      'Unable to prepare the Etherlink transaction. Please try again.'
    );
  });
});

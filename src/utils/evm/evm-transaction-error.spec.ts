import { BaseError, encodeErrorResult, FeeCapTooLowError, InsufficientFundsError, NonceTooLowError } from 'viem';

import { erc1155Abi } from 'src/utils/evm/on-chain/abi/erc1155.abi';

import { EVM_TRANSACTION_ERROR_MESSAGES, normalizeEvmTransactionError } from './evm-transaction-error';
import { EvmTransactionSubmissionError } from './evm-transaction-submission-error';

const SOURCE_ADDRESS = '0x1111111111111111111111111111111111111111';

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

  it('reads serialized viem errors and their nested causes', () => {
    const error = {
      name: 'TransactionExecutionError',
      message: 'Transaction failed',
      details: 'RPC request failed',
      shortMessage: 'Could not submit transaction',
      metaMessages: [],
      cause: { name: 'NonceTooLowError', message: 'Nonce is too low' }
    };

    expect(normalizeEvmTransactionError(error)).toMatchObject({
      code: 'nonce-too-low',
      message: EVM_TRANSACTION_ERROR_MESSAGES.nonceTooLow
    });
  });

  it('does not expose an unknown contract revert reason', () => {
    const error = new BaseError('Execution reverted', { details: 'The contract is paused' });

    expect(normalizeEvmTransactionError(error)).toMatchObject({
      code: 'execution-reverted',
      message: EVM_TRANSACTION_ERROR_MESSAGES.executionFailed
    });
  });

  it('does not expose an unknown raw RPC error to the user', () => {
    expect(normalizeEvmTransactionError(new Error('sensitive rpc response')).message).toBe(
      EVM_TRANSACTION_ERROR_MESSAGES.unknown
    );
  });

  it('decodes ERC-1155 custom errors', () => {
    const error = new Error('Execution reverted') as Error & { data: HexString };
    error.data = encodeErrorResult({
      abi: erc1155Abi,
      errorName: 'ERC1155InsufficientBalance',
      args: [SOURCE_ADDRESS, 1n, 2n, 3n]
    });

    expect(normalizeEvmTransactionError(error)).toMatchObject({
      code: 'insufficient-asset-balance',
      message: EVM_TRANSACTION_ERROR_MESSAGES.balance
    });
  });

  it('preserves a submitted hash when receipt polling fails', () => {
    const hash = `0x${'1'.repeat(64)}` as HexString;
    const error = new EvmTransactionSubmissionError('receipt-unavailable', 'Unable to obtain the transaction receipt', {
      cause: new Error('RPC failed'),
      transactionHash: hash
    });

    expect(normalizeEvmTransactionError(error)).toMatchObject({
      code: 'timeout',
      pendingTransactionHash: hash
    });
  });

  it.each([
    ['account-unavailable', 'unknown'],
    ['signer-address-mismatch', 'invalid-params'],
    ['transaction-replaced', 'execution-reverted'],
    ['transaction-reverted', 'execution-reverted']
  ] as const)('maps submission error %s to %s', (submissionCode, expectedCode) => {
    const error = new EvmTransactionSubmissionError(submissionCode, 'Submission failed');

    expect(normalizeEvmTransactionError(error).code).toBe(expectedCode);
  });
});

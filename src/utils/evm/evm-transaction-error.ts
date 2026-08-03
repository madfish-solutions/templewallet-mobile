import {
  decodeErrorResult,
  FeeCapTooHighError,
  FeeCapTooLowError,
  Hash,
  HttpRequestError,
  InsufficientFundsError,
  IntrinsicGasTooHighError,
  IntrinsicGasTooLowError,
  NonceTooHighError,
  NonceTooLowError,
  TimeoutError,
  TipAboveFeeCapError,
  TransactionTypeNotSupportedError
} from 'viem';

import { erc1155Abi } from 'src/utils/evm/on-chain/abi/erc1155.abi';

import { EvmTransactionSubmissionError } from './evm-transaction-submission-error';

export type EvmTransactionErrorCode =
  | 'network'
  | 'timeout'
  | 'insufficient-native-balance'
  | 'insufficient-asset-balance'
  | 'fee-too-low'
  | 'invalid-fee'
  | 'invalid-params'
  | 'nonce-too-low'
  | 'nonce-too-high'
  | 'not-approved'
  | 'execution-reverted'
  | 'unsupported-transaction'
  | 'unknown';

export interface EvmTransactionError {
  code: EvmTransactionErrorCode;
  message: string;
  cause: unknown;
  /** Present only when broadcasting succeeded and retrying must resume receipt polling. */
  pendingTransactionHash?: Hash;
}

export const EVM_TRANSACTION_ERROR_MESSAGES = {
  balance: 'Looks like your wallet is running low. Top up balance and try again.',
  lowGasBalance: 'Gas balance is not enough to complete transaction. Top up and retry.',
  feeTooLow: 'Fee is too low, blockchain says: "No tip, no trip". Add more fee and try again.',
  invalidParams: "The blockchain didn't like these parameters. Some details may be invalid or incomplete.",
  timeout: 'The transaction is taking longer than expected. Check network status or try again.',
  executionFailed: 'The transaction failed during execution. Review the transaction details.',
  network: 'Unable to connect to the network. Please retry or switch endpoint.',
  nonceTooHigh: 'Transaction nonce is too high. Reset your account or wait for pending transactions.',
  nonceTooLow: 'Transaction nonce is too low. Reset your account or wait for pending transactions.',
  allowanceTooLow: 'Token allowance is insufficient. Increase the allowance and try again.',
  notApproved: 'Not all tokens are approved. Please approve spending all necessary tokens and try again.',
  unknown: "The blockchain just said '¯\\_(ツ)_/¯'. Review details or try again (maybe it will work)."
} as const;

const LOW_NATIVE_BALANCE_PATTERNS = [
  'total cost (gas * gas fee + value)',
  'insufficient funds',
  'gas required exceeds allowance'
];

const LOW_ASSET_BALANCE_PATTERNS = [
  'transfer amount exceeds balance',
  'erc1155: insufficient balance',
  'erc1155insufficientbalance',
  'burn amount exceeds balance'
];

const NOT_APPROVED_PATTERNS = [
  'insufficient allowance',
  'transfer amount exceeds allowance',
  'missing approval',
  'caller is not token owner or approved',
  'caller is not owner nor approved',
  'erc1155missingapprovalforall'
];

const INVALID_PARAMS_PATTERNS = [
  'transfer from the zero address',
  'transfer to the zero address',
  'approve from the zero address',
  'approve to the zero address',
  'invalid receiver',
  'invalid sender',
  'invalid token id',
  'transfer from incorrect owner',
  'invalid parameters',
  'invalid evm gas estimation',
  'invalid legacy fee estimation',
  'invalid eip-1559 fee estimation'
];

const FEE_TOO_LOW_PATTERNS = [
  'transaction underpriced',
  'priority fee too low',
  'intrinsic gas too low',
  'max fee per gas less than block base fee'
];

const includesAny = (value: string, patterns: string[]) => patterns.some(pattern => value.includes(pattern));

const getErrorChain = (error: unknown) => {
  const chain: unknown[] = [];
  const visited = new Set<unknown>();
  let current = error;

  while (current && !visited.has(current)) {
    chain.push(current);
    visited.add(current);
    current = typeof current === 'object' && 'cause' in current ? current.cause : undefined;
  }

  return chain;
};

const hasErrorName = (error: unknown, names: string[]) =>
  getErrorChain(error).some(
    candidate =>
      typeof candidate === 'object' &&
      candidate !== null &&
      'name' in candidate &&
      typeof candidate.name === 'string' &&
      names.includes(candidate.name)
  );

const getErrorText = (error: unknown) =>
  getErrorChain(error)
    .flatMap(candidate => {
      if (typeof candidate === 'string') return [candidate];
      if (typeof candidate !== 'object' || candidate === null) return [];

      const details = 'details' in candidate && typeof candidate.details === 'string' ? candidate.details : undefined;
      const shortMessage =
        'shortMessage' in candidate && typeof candidate.shortMessage === 'string' ? candidate.shortMessage : undefined;
      const message = 'message' in candidate && typeof candidate.message === 'string' ? candidate.message : undefined;
      const metaMessages =
        'metaMessages' in candidate && Array.isArray(candidate.metaMessages)
          ? candidate.metaMessages.filter((value): value is string => typeof value === 'string')
          : [];

      return [details, shortMessage, ...metaMessages, message];
    })
    .filter((value): value is string => Boolean(value))
    .join('\n')
    .toLowerCase();

const getRawErrorData = (error: unknown) => {
  for (const candidate of getErrorChain(error)) {
    if (
      typeof candidate === 'object' &&
      candidate !== null &&
      'data' in candidate &&
      typeof candidate.data === 'string'
    ) {
      return candidate.data;
    }
  }

  return undefined;
};

const decodeErc1155Error = (error: unknown): EvmTransactionError | undefined => {
  const data = getRawErrorData(error);
  if (!data?.startsWith('0x')) return undefined;

  try {
    const { errorName } = decodeErrorResult({ abi: erc1155Abi, data: data as HexString });

    switch (errorName) {
      case 'ERC1155InsufficientBalance':
        return {
          code: 'insufficient-asset-balance',
          message: EVM_TRANSACTION_ERROR_MESSAGES.balance,
          cause: error
        };
      case 'ERC1155MissingApprovalForAll':
        return { code: 'not-approved', message: EVM_TRANSACTION_ERROR_MESSAGES.notApproved, cause: error };
      case 'ERC1155InvalidSender':
      case 'ERC1155InvalidReceiver':
      case 'ERC1155InvalidApprover':
      case 'ERC1155InvalidOperator':
      case 'ERC1155InvalidArrayLength':
        return { code: 'invalid-params', message: EVM_TRANSACTION_ERROR_MESSAGES.invalidParams, cause: error };
    }
  } catch {
    // The revert data belongs to another contract or does not match a known ERC-1155 error.
  }

  return undefined;
};

const makeError = (code: EvmTransactionErrorCode, message: string, cause: unknown): EvmTransactionError => ({
  code,
  message,
  cause
});

const normalizeSubmissionError = (error: EvmTransactionSubmissionError): EvmTransactionError => {
  switch (error.code) {
    case 'receipt-unavailable': {
      const causeError = normalizeEvmTransactionError(error.cause);
      const normalizedCause =
        causeError.code === 'network' || causeError.code === 'timeout'
          ? causeError
          : makeError('timeout', EVM_TRANSACTION_ERROR_MESSAGES.timeout, error);

      return { ...normalizedCause, cause: error, pendingTransactionHash: error.transactionHash };
    }
    case 'signer-address-mismatch':
      return makeError('invalid-params', EVM_TRANSACTION_ERROR_MESSAGES.invalidParams, error);
    case 'transaction-replaced':
    case 'transaction-reverted':
      return makeError('execution-reverted', EVM_TRANSACTION_ERROR_MESSAGES.executionFailed, error);
    case 'account-unavailable':
      return makeError('unknown', EVM_TRANSACTION_ERROR_MESSAGES.unknown, error);
  }
};

export function normalizeEvmTransactionError(error: unknown): EvmTransactionError {
  if (error instanceof EvmTransactionSubmissionError) {
    return normalizeSubmissionError(error);
  }

  if (error instanceof HttpRequestError || hasErrorName(error, ['HttpRequestError', 'SocketError'])) {
    return makeError('network', EVM_TRANSACTION_ERROR_MESSAGES.network, error);
  }

  if (error instanceof TimeoutError || hasErrorName(error, ['TimeoutError', 'WaitForTransactionReceiptTimeoutError'])) {
    return makeError('timeout', EVM_TRANSACTION_ERROR_MESSAGES.timeout, error);
  }

  if (error instanceof NonceTooLowError || hasErrorName(error, ['NonceTooLowError'])) {
    return makeError('nonce-too-low', EVM_TRANSACTION_ERROR_MESSAGES.nonceTooLow, error);
  }

  if (error instanceof NonceTooHighError || hasErrorName(error, ['NonceTooHighError'])) {
    return makeError('nonce-too-high', EVM_TRANSACTION_ERROR_MESSAGES.nonceTooHigh, error);
  }

  if (error instanceof InsufficientFundsError || hasErrorName(error, ['InsufficientFundsError'])) {
    return makeError('insufficient-native-balance', EVM_TRANSACTION_ERROR_MESSAGES.lowGasBalance, error);
  }

  if (
    error instanceof IntrinsicGasTooLowError ||
    error instanceof FeeCapTooLowError ||
    hasErrorName(error, ['IntrinsicGasTooLowError', 'FeeCapTooLowError'])
  ) {
    return makeError('fee-too-low', EVM_TRANSACTION_ERROR_MESSAGES.feeTooLow, error);
  }

  if (
    error instanceof IntrinsicGasTooHighError ||
    error instanceof FeeCapTooHighError ||
    error instanceof TipAboveFeeCapError ||
    hasErrorName(error, ['IntrinsicGasTooHighError', 'FeeCapTooHighError', 'TipAboveFeeCapError'])
  ) {
    return makeError('invalid-fee', EVM_TRANSACTION_ERROR_MESSAGES.invalidParams, error);
  }

  if (error instanceof TransactionTypeNotSupportedError || hasErrorName(error, ['TransactionTypeNotSupportedError'])) {
    return makeError('unsupported-transaction', EVM_TRANSACTION_ERROR_MESSAGES.invalidParams, error);
  }

  const errorText = getErrorText(error);

  if (includesAny(errorText, ['network', 'connection', 'failed to fetch', 'econnrefused', 'enotfound'])) {
    return makeError('network', EVM_TRANSACTION_ERROR_MESSAGES.network, error);
  }

  if (errorText.includes('timeout') || errorText.includes('timed out')) {
    return makeError('timeout', EVM_TRANSACTION_ERROR_MESSAGES.timeout, error);
  }

  if (includesAny(errorText, LOW_NATIVE_BALANCE_PATTERNS)) {
    return makeError('insufficient-native-balance', EVM_TRANSACTION_ERROR_MESSAGES.lowGasBalance, error);
  }

  if (includesAny(errorText, LOW_ASSET_BALANCE_PATTERNS)) {
    return makeError('insufficient-asset-balance', EVM_TRANSACTION_ERROR_MESSAGES.balance, error);
  }

  if (includesAny(errorText, NOT_APPROVED_PATTERNS)) {
    const message = errorText.includes('allowance')
      ? EVM_TRANSACTION_ERROR_MESSAGES.allowanceTooLow
      : EVM_TRANSACTION_ERROR_MESSAGES.notApproved;

    return makeError('not-approved', message, error);
  }

  if (includesAny(errorText, FEE_TOO_LOW_PATTERNS)) {
    return makeError('fee-too-low', EVM_TRANSACTION_ERROR_MESSAGES.feeTooLow, error);
  }

  if (includesAny(errorText, INVALID_PARAMS_PATTERNS)) {
    return makeError('invalid-params', EVM_TRANSACTION_ERROR_MESSAGES.invalidParams, error);
  }

  if (errorText.includes('nonce')) {
    if (errorText.includes('too high')) {
      return makeError('nonce-too-high', EVM_TRANSACTION_ERROR_MESSAGES.nonceTooHigh, error);
    }

    if (errorText.includes('too low') || errorText.includes('already')) {
      return makeError('nonce-too-low', EVM_TRANSACTION_ERROR_MESSAGES.nonceTooLow, error);
    }

    return makeError('invalid-params', EVM_TRANSACTION_ERROR_MESSAGES.invalidParams, error);
  }

  const decodedErc1155Error = decodeErc1155Error(error);
  if (decodedErc1155Error) return decodedErc1155Error;

  if (errorText.includes('revert') || errorText.includes('execution failed') || errorText.includes('rejected')) {
    return makeError('execution-reverted', EVM_TRANSACTION_ERROR_MESSAGES.executionFailed, error);
  }

  if (errorText.includes('gas')) {
    return makeError('insufficient-native-balance', EVM_TRANSACTION_ERROR_MESSAGES.lowGasBalance, error);
  }

  if (errorText.includes('balance') || errorText.includes('insufficient')) {
    return makeError('insufficient-asset-balance', EVM_TRANSACTION_ERROR_MESSAGES.balance, error);
  }

  if (errorText.includes('fee')) {
    return makeError('fee-too-low', EVM_TRANSACTION_ERROR_MESSAGES.feeTooLow, error);
  }

  if (
    errorText.includes('parameter') ||
    errorText.includes('invalid') ||
    errorText.includes('validation') ||
    errorText.includes('malformed')
  ) {
    return makeError('invalid-params', EVM_TRANSACTION_ERROR_MESSAGES.invalidParams, error);
  }

  if (errorText.includes('failed')) {
    return makeError('execution-reverted', EVM_TRANSACTION_ERROR_MESSAGES.executionFailed, error);
  }

  return makeError('unknown', EVM_TRANSACTION_ERROR_MESSAGES.unknown, error);
}

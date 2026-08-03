import { BaseError } from 'viem';

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
}

const ERROR_NAMES_BY_CODE: Partial<Record<EvmTransactionErrorCode, string[]>> = {
  network: ['HttpRequestError', 'SocketError'],
  timeout: ['TimeoutError'],
  'insufficient-native-balance': ['InsufficientFundsError'],
  'fee-too-low': ['FeeCapTooLowError', 'IntrinsicGasTooLowError'],
  'invalid-fee': ['FeeCapTooHighError', 'TipAboveFeeCapError'],
  'invalid-params': ['IntrinsicGasTooHighError'],
  'nonce-too-low': ['NonceTooLowError'],
  'nonce-too-high': ['NonceTooHighError'],
  'unsupported-transaction': ['TransactionTypeNotSupportedError']
};

const hasErrorName = (error: unknown, names: string[]) => {
  if (!(error instanceof Error)) return false;
  if (names.includes(error.name)) return true;

  return (
    error instanceof BaseError &&
    Boolean(error.walk(candidate => candidate instanceof Error && names.includes(candidate.name)))
  );
};

const hasErrorCode = (error: unknown, code: EvmTransactionErrorCode) =>
  hasErrorName(error, ERROR_NAMES_BY_CODE[code] ?? []);

const includesAny = (value: string, patterns: string[]) => patterns.some(pattern => value.includes(pattern));

export const normalizeEvmTransactionError = (error: unknown): EvmTransactionError => {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const normalizedMessage = rawMessage.toLowerCase();

  if (hasErrorCode(error, 'timeout')) {
    return { code: 'timeout', message: 'The EVM network request timed out. Please try again.', cause: error };
  }

  if (
    hasErrorCode(error, 'network') ||
    includesAny(normalizedMessage, ['network', 'connection', 'failed to fetch', 'econnrefused', 'enotfound'])
  ) {
    return {
      code: 'network',
      message: 'Unable to reach the EVM network. Check your connection and try again.',
      cause: error
    };
  }

  if (
    hasErrorCode(error, 'insufficient-native-balance') ||
    includesAny(normalizedMessage, [
      'insufficient funds',
      'gas required exceeds allowance',
      'total cost (gas * gas fee + value)'
    ])
  ) {
    return {
      code: 'insufficient-native-balance',
      message: 'Insufficient XTZ balance for the amount and network fee.',
      cause: error
    };
  }

  if (
    includesAny(normalizedMessage, [
      'transfer amount exceeds balance',
      'erc1155: insufficient balance',
      'erc1155insufficientbalance',
      'burn amount exceeds balance'
    ])
  ) {
    return { code: 'insufficient-asset-balance', message: 'Insufficient asset balance.', cause: error };
  }

  if (
    hasErrorCode(error, 'fee-too-low') ||
    includesAny(normalizedMessage, [
      'transaction underpriced',
      'priority fee too low',
      'intrinsic gas too low',
      'max fee per gas less than block base fee'
    ])
  ) {
    return { code: 'fee-too-low', message: 'The selected gas price is too low.', cause: error };
  }

  if (hasErrorCode(error, 'invalid-fee')) {
    return { code: 'invalid-fee', message: 'The selected gas price is invalid.', cause: error };
  }

  if (
    includesAny(normalizedMessage, [
      'invalid evm gas estimation',
      'invalid legacy fee estimation',
      'invalid eip-1559 fee estimation'
    ])
  ) {
    return { code: 'invalid-fee', message: 'The network returned an invalid gas-price estimate.', cause: error };
  }

  if (
    hasErrorCode(error, 'unsupported-transaction') ||
    normalizedMessage.includes('unsupported evm transaction type')
  ) {
    return {
      code: 'unsupported-transaction',
      message: 'This Etherlink transaction type is not supported.',
      cause: error
    };
  }

  if (
    hasErrorCode(error, 'nonce-too-low') ||
    includesAny(normalizedMessage, ['nonce too low', 'nonce has already been used'])
  ) {
    return { code: 'nonce-too-low', message: 'The transaction nonce is too low. Please try again.', cause: error };
  }

  if (hasErrorCode(error, 'nonce-too-high') || normalizedMessage.includes('nonce too high')) {
    return { code: 'nonce-too-high', message: 'The transaction nonce is too high. Please try again.', cause: error };
  }

  if (
    includesAny(normalizedMessage, [
      'insufficient allowance',
      'missing approval',
      'caller is not token owner or approved',
      'caller is not owner nor approved'
    ])
  ) {
    return { code: 'not-approved', message: 'The account is not approved to transfer this asset.', cause: error };
  }

  if (
    hasErrorCode(error, 'invalid-params') ||
    includesAny(normalizedMessage, [
      'transfer to the zero address',
      'invalid receiver',
      'invalid token id',
      'transfer from incorrect owner',
      'invalid parameters'
    ])
  ) {
    return { code: 'invalid-params', message: 'The transaction parameters are invalid.', cause: error };
  }

  if (includesAny(normalizedMessage, ['revert', 'execution failed'])) {
    const details = error instanceof BaseError ? error.details : undefined;

    return {
      code: 'execution-reverted',
      message: details && details.length < 180 ? details : 'The transaction would fail during execution.',
      cause: error
    };
  }

  return { code: 'unknown', message: 'Unable to prepare the Etherlink transaction. Please try again.', cause: error };
};

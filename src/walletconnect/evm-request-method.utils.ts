import {
  EVM_WC_ACCOUNTS_METHODS,
  EVM_WC_METHODS,
  EVM_WC_OLD_TYPED_DATA_METHODS,
  EVM_WC_SEND_TRANSACTION_METHODS,
  EVM_WC_SIGNING_METHODS,
  EVM_WC_TYPED_DATA_METHODS,
  EVM_WC_WATCH_ASSET_METHODS
} from './constants';

type EvmWcAccountsMethod = (typeof EVM_WC_ACCOUNTS_METHODS)[number];
type EvmWcOldTypedDataMethod = (typeof EVM_WC_OLD_TYPED_DATA_METHODS)[number];
export type EvmWcTypedDataMethod = (typeof EVM_WC_TYPED_DATA_METHODS)[number];
type EvmWcSigningMethod = (typeof EVM_WC_SIGNING_METHODS)[number];
type EvmWcSendTransactionMethod = (typeof EVM_WC_SEND_TRANSACTION_METHODS)[number];
type EvmWcWatchAssetMethod = (typeof EVM_WC_WATCH_ASSET_METHODS)[number];

type EvmWcMethod = EvmWcAccountsMethod | EvmWcSigningMethod | EvmWcSendTransactionMethod | EvmWcWatchAssetMethod;

export const isSupportedWcMethod = (method: string): method is EvmWcMethod =>
  EVM_WC_METHODS.some(supportedMethod => supportedMethod === method);

export const isWcTypedDataMethod = (method: string): method is EvmWcTypedDataMethod =>
  EVM_WC_TYPED_DATA_METHODS.some(typedDataMethod => typedDataMethod === method);

export const isWcOldTypedDataMethod = (method: string): method is EvmWcOldTypedDataMethod =>
  EVM_WC_OLD_TYPED_DATA_METHODS.some(typedDataMethod => typedDataMethod === method);

export const isWcSigningMethod = (method: string): method is EvmWcSigningMethod =>
  EVM_WC_SIGNING_METHODS.some(signingMethod => signingMethod === method);

export const isWcAccountsMethod = (method: string): method is EvmWcAccountsMethod =>
  EVM_WC_ACCOUNTS_METHODS.some(accountsMethod => accountsMethod === method);

export const isWcSendTransactionMethod = (method: string): method is EvmWcSendTransactionMethod =>
  EVM_WC_SEND_TRANSACTION_METHODS.some(sendTransactionMethod => sendTransactionMethod === method);

export const isWcWatchAssetMethod = (method: string): method is EvmWcWatchAssetMethod =>
  EVM_WC_WATCH_ASSET_METHODS.some(watchAssetMethod => watchAssetMethod === method);

/**
 * Best-effort extraction of the request's authorizing address from raw JSON-RPC params.
 * Returns `undefined` when the method has no address in params or the shape is unexpected.
 */
export const getWcRequestAddress = (method: string, params: unknown): string | undefined => {
  if (!Array.isArray(params)) {
    return undefined;
  }

  if (isWcSendTransactionMethod(method)) {
    const from = params[0]?.from;

    return typeof from === 'string' ? from : undefined;
  }

  if (method === 'personal_sign' || isWcOldTypedDataMethod(method)) {
    return typeof params[1] === 'string' ? params[1] : undefined;
  }

  if (isWcTypedDataMethod(method)) {
    return typeof params[0] === 'string' ? params[0] : undefined;
  }

  return undefined;
};

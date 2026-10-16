export type WcEvmRequestErrorCode =
  | 'account-unavailable'
  | 'signer-address-mismatch'
  | 'invalid-params'
  | 'unsupported-method'
  | 'unsupported-typed-data-version'
  | 'signing-failed'
  | 'broadcast-failed';

interface WcEvmRequestErrorContext {
  cause?: unknown;
}

export class WcEvmRequestError extends Error {
  readonly name = 'WcEvmRequestError';
  readonly cause?: unknown;

  constructor(readonly code: WcEvmRequestErrorCode, message: string, { cause }: WcEvmRequestErrorContext = {}) {
    super(message);
    this.cause = cause;
  }
}

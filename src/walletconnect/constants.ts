// TODO: add adding and switching chains support
export const EVM_WC_METHODS = [
  'eth_accounts',
  'eth_requestAccounts',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
  'eth_sendTransaction',
  'personal_sign',
  'wallet_watchAsset'
] as const;

export type EvmWcMethod = (typeof EVM_WC_METHODS)[number];

export const EVM_WC_EVENTS = ['accountsChanged'] as const;

export const isSupportedWcMethod = (method: string): method is EvmWcMethod =>
  EVM_WC_METHODS.some(supportedMethod => supportedMethod === method);

// TODO: add adding and switching chains support

export const EVM_WC_ACCOUNTS_METHODS = ['eth_accounts', 'eth_requestAccounts'] as const;

export const EVM_WC_OLD_TYPED_DATA_METHODS = ['eth_signTypedData', 'eth_signTypedData_v1'] as const;

const EVM_WC_MODERN_TYPED_DATA_METHODS = ['eth_signTypedData_v3', 'eth_signTypedData_v4'] as const;

export const EVM_WC_TYPED_DATA_METHODS = [
  ...EVM_WC_OLD_TYPED_DATA_METHODS,
  ...EVM_WC_MODERN_TYPED_DATA_METHODS
] as const;

export const EVM_WC_SIGNING_METHODS = ['personal_sign', ...EVM_WC_TYPED_DATA_METHODS] as const;

export const EVM_WC_SEND_TRANSACTION_METHODS = ['eth_sendTransaction'] as const;

export const EVM_WC_WATCH_ASSET_METHODS = ['wallet_watchAsset'] as const;

export const EVM_WC_METHODS = [
  ...EVM_WC_ACCOUNTS_METHODS,
  ...EVM_WC_SIGNING_METHODS,
  ...EVM_WC_SEND_TRANSACTION_METHODS,
  ...EVM_WC_WATCH_ASSET_METHODS
] as const;

export const EVM_WC_EVENTS = ['accountsChanged'] as const;

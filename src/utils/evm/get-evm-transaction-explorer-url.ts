export const getEvmTransactionExplorerUrl = (blockExplorerUrl: string, hash: string) =>
  `${blockExplorerUrl}/tx/${hash}`;

import { Hash } from 'viem';

import { showSuccessToast } from 'src/toast/toast.utils';
import { EvmChain } from 'src/types/networks';

import { getEvmTransactionExplorerUrl } from './get-evm-transaction-explorer-url';

export const showEvmTransactionSuccessToast = (
  chain: Pick<EvmChain, 'name' | 'activeBlockExplorer'>,
  hash: Hash,
  status: 'submitted' | 'confirmed'
): void => {
  showSuccessToast({
    operationHash: hash,
    operationUrl: getEvmTransactionExplorerUrl(chain.activeBlockExplorer.url, hash),
    title: 'Success!',
    description:
      status === 'submitted' ? 'Transaction request sent! Confirming...' : `${chain.name} transaction confirmed`
  });
};

import { useCallback, useRef, useState } from 'react';

import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { dispatch as storeDispatch } from 'src/store';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { buildPreparedEvmTransaction } from 'src/utils/evm/build-prepared-evm-transaction';
import { EvmSubmissionFees } from 'src/utils/evm/estimate-evm-transaction';
import { loadEtherlinkBalancesOnChain } from 'src/utils/evm/etherlink-balances.utils';
import { normalizeEvmTransactionError } from 'src/utils/evm/evm-transaction-error';
import { evmTransactionSubmissionService } from 'src/utils/evm/evm-transaction-submission';
import { getEvmTransactionExplorerUrl } from 'src/utils/evm/get-evm-transaction-explorer-url';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

interface Props {
  chainId: number;
  sourceAddress?: HexString;
  request?: EvmTransactionRequest;
}

export const useEvmTransactionSubmission = ({ chainId, sourceAddress, request }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInProgressRef = useRef(false);
  const chain = useEvmChain(chainId);
  const knownAssets = useEvmAccountChainAssetsSelector(sourceAddress, chainId);

  const submit = useCallback(
    async ({ gasLimit, fees }: EvmSubmissionFees) => {
      if (submissionInProgressRef.current || !sourceAddress || !chain || !request) {
        return;
      }

      submissionInProgressRef.current = true;
      setIsSubmitting(true);
      const network = toEvmNetworkEssentials(chain);
      const result = await evmTransactionSubmissionService.submit({
        network,
        sourceAddress,
        transaction: buildPreparedEvmTransaction(request, { gasLimit, fees }),
        // Increase confirmations amount for other blockchains to reduce stale balance reads
        receiptOptions: { confirmations: network.chainId === ETHERLINK_MAINNET_CHAIN_ID ? 2 : 1 },
        onBroadcast: hash => {
          showSuccessToast({
            operationHash: hash,
            operationUrl: getEvmTransactionExplorerUrl(chain.activeBlockExplorer.url, hash),
            title: 'Success!',
            description: 'Transaction request sent! Confirming...'
          });
          storeDispatch(navigateAction({ screen: StacksEnum.MainStack }));
        }
      });

      setIsSubmitting(false);
      submissionInProgressRef.current = false;

      if (!result.success) {
        const { message } = normalizeEvmTransactionError(result.error);

        showErrorToast({ title: `Failed to confirm ${chain.name} transaction`, description: message });

        return;
      }

      const hash = result.receipt.transactionHash;

      showSuccessToast({
        operationHash: hash,
        operationUrl: getEvmTransactionExplorerUrl(chain.activeBlockExplorer.url, hash),
        title: 'Success!',
        description: `${chain.name} transaction confirmed`
      });

      void loadEtherlinkBalancesOnChain({ network, account: sourceAddress, knownAssets }).catch(console.error);
    },
    [chain, knownAssets, request, sourceAddress]
  );

  return { isSubmitting, submit };
};

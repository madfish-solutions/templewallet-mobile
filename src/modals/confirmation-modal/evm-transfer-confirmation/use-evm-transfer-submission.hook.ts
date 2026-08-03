import { useCallback, useState } from 'react';
import { firstValueFrom } from 'rxjs';

import { useEvmPublicClient } from 'src/hooks/evm/use-etherlink-public-client.hook';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { Shelter } from 'src/shelter/shelter';
import { dispatch as storeDispatch } from 'src/store';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { showSuccessToast } from 'src/toast/toast.utils';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { EvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';
import { EvmFees } from 'src/utils/evm/estimate-evm-transaction';
import { loadEtherlinkBalancesOnChain } from 'src/utils/evm/etherlink-balances.utils';
import { EvmTransactionError, normalizeEvmTransactionError } from 'src/utils/evm/evm-transaction-error';
import { getViemWalletClient } from 'src/utils/rpc/evm-client.utils';

interface Props {
  chainId: number;
  sourceAddress?: HexString;
  request?: EvmTransferRequest;
  gasLimit?: bigint;
  fees?: EvmFees;
}

export const useEvmTransferSubmission = ({ chainId, sourceAddress, request, gasLimit, fees }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<EvmTransactionError>();
  const chain = useEvmChain(chainId);
  const publicClient = useEvmPublicClient(chainId);
  const knownAssets = useEvmAccountChainAssetsSelector(sourceAddress, chainId);

  const submit = useCallback(async () => {
    if (!sourceAddress || !chain || !publicClient || !request || !gasLimit || !fees) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(undefined);

    try {
      const signer = await firstValueFrom(Shelter.getEvmAccount$(sourceAddress));
      const walletClient = getViemWalletClient(toEvmNetworkEssentials(chain), signer);
      const hash = await walletClient.sendTransaction({
        ...request,
        account: signer,
        gas: gasLimit,
        ...fees
      });

      showSuccessToast({
        operationHash: hash,
        operationUrl: `${chain.activeBlockExplorer.url}/tx/${hash}`,
        title: 'Success!',
        description: `${chain.name} transaction submitted`
      });
      storeDispatch(navigateAction({ screen: StacksEnum.MainStack }));

      void publicClient
        .waitForTransactionReceipt({ hash })
        .then(() =>
          loadEtherlinkBalancesOnChain({
            network: toEvmNetworkEssentials(chain),
            account: sourceAddress,
            knownAssets
          })
        )
        .catch(console.error);
    } catch (error) {
      setSubmissionError(normalizeEvmTransactionError(error));
      setIsSubmitting(false);
    }
  }, [chain, fees, gasLimit, knownAssets, publicClient, request, sourceAddress]);

  const resetSubmissionError = useCallback(() => setSubmissionError(undefined), []);

  return { isSubmitting, resetSubmissionError, submissionError, submit };
};

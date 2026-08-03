import { useCallback, useState } from 'react';
import { firstValueFrom } from 'rxjs';

import { useEtherlinkPublicClient } from 'src/hooks/evm/use-etherlink-public-client.hook';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { Shelter } from 'src/shelter/shelter';
import { dispatch as storeDispatch } from 'src/store';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { showSuccessToast } from 'src/toast/toast.utils';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { EvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';
import { loadEtherlinkBalancesOnChain } from 'src/utils/evm/etherlink-balances.utils';
import { getViemWalletClient } from 'src/utils/rpc/evm-client.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

interface Props {
  sourceAddress?: HexString;
  request?: EvmTransferRequest;
  gasLimit?: bigint;
  gasPrice?: bigint;
}

export const useEvmTransferSubmission = ({ sourceAddress, request, gasLimit, gasPrice }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);
  const publicClient = useEtherlinkPublicClient();
  const knownAssets = useEvmAccountChainAssetsSelector(sourceAddress, ETHERLINK_MAINNET_CHAIN_ID);

  const submit = useCallback(async () => {
    if (!sourceAddress || !chain || !request || !gasLimit || !gasPrice) {
      return;
    }

    setIsSubmitting(true);

    try {
      const signer = await firstValueFrom(Shelter.getEvmAccount$(sourceAddress));
      const walletClient = getViemWalletClient(toEvmNetworkEssentials(chain), signer);
      const hash = await walletClient.sendTransaction({
        ...request,
        account: signer,
        gas: gasLimit,
        gasPrice
      });

      showSuccessToast({
        operationHash: hash,
        operationUrl: `https://explorer.etherlink.com/tx/${hash}`,
        title: 'Success!',
        description: 'Etherlink transaction submitted'
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
      showErrorToastByError(error);
      setIsSubmitting(false);
    }
  }, [chain, gasLimit, gasPrice, knownAssets, publicClient, request, sourceAddress]);

  return { isSubmitting, submit };
};

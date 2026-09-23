import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { isAddress } from 'viem';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useViemPublicClient } from 'src/hooks/evm/use-viem-public-client.hook';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { SendAsset } from 'src/types/send-asset';
import { estimateEvmTransaction } from 'src/utils/evm/estimate-evm-transaction';
import { cancellablePromiseFlow } from 'src/utils/promise.util';

const RECIPIENT_DEBOUNCE_MS = 300;
const ESTIMATION_RECIPIENT: HexString = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

interface UseEvmMaxAmountParams {
  asset: SendAsset;
  recipient: string;
  sourceAddress?: HexString;
}

/**
 * Uses the same strategy as the extension: estimate a one-atomic-unit native
 * transfer, then reserve the estimated fee from the amount available to send.
 */
export const useEvmMaxAmount = ({ asset, recipient, sourceAddress }: UseEvmMaxAmountParams) => {
  const isNativeEvmAsset =
    asset.chainKind === TempleChainKind.EVM && asset.sendStandard === EvmAssetStandardEnum.NATIVE;
  const chainId = asset.chainKind === TempleChainKind.EVM ? asset.chainId : 0;
  const publicClient = useViemPublicClient(chainId);
  const [fee, setFee] = useState<bigint>();
  const to = isAddress(recipient) ? recipient : ESTIMATION_RECIPIENT;

  useEffect(() => {
    let cancelled = false;

    if (!isNativeEvmAsset || !sourceAddress || !publicClient) {
      setFee(undefined);

      return;
    }

    const estimate = () =>
      cancellablePromiseFlow({
        promise: estimateEvmTransaction(publicClient, sourceAddress, {
          to,
          value: 1n
        }),
        isCancelled: () => cancelled,
        then: estimation => setFee(estimation.estimatedFee),
        catch: () => setFee(0n)
      });
    const timeoutId = setTimeout(() => {
      void estimate();
    }, RECIPIENT_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [to, isNativeEvmAsset, publicClient, sourceAddress]);

  const maxAmount = useMemo(() => {
    const balance = new BigNumber(asset.balance);

    if (!isNativeEvmAsset) {
      return undefined;
    }

    return fee !== undefined ? BigNumber.maximum(balance.minus(fee.toString()), 0) : balance;
  }, [asset.balance, fee, isNativeEvmAsset]);

  return { maxAmount, isEstimating: isNativeEvmAsset && fee === undefined };
};

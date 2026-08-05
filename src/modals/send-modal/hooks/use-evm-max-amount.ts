import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { isAddress } from 'viem';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useViemPublicClient } from 'src/hooks/evm/use-viem-public-client.hook';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { SendAsset } from 'src/types/send-asset';
import { estimateEvmTransaction } from 'src/utils/evm/estimate-evm-transaction';

const ESTIMATION_RECIPIENT = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as HexString;

interface UseEvmMaxAmountParams {
  asset: SendAsset;
  recipient: string;
  sourceAddress?: string;
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

  useEffect(() => {
    let cancelled = false;

    if (!isNativeEvmAsset || !sourceAddress || !publicClient) {
      setFee(undefined);

      return;
    }

    const estimate = async () => {
      try {
        const estimation = await estimateEvmTransaction(publicClient, sourceAddress as HexString, {
          to: (isAddress(recipient) ? recipient : ESTIMATION_RECIPIENT) as HexString,
          value: 1n
        });

        if (!cancelled) setFee(estimation.estimatedFee);
      } catch {
        if (!cancelled) setFee(undefined);
      }
    };

    void estimate();

    return () => {
      cancelled = true;
    };
  }, [isNativeEvmAsset, publicClient, recipient, sourceAddress]);

  const maxAmount = useMemo(() => {
    const balance = new BigNumber(asset.balance);

    if (!isNativeEvmAsset) {
      return undefined;
    }

    return fee !== undefined ? BigNumber.maximum(balance.minus(fee.toString()), 0) : balance;
  }, [asset.balance, fee, isNativeEvmAsset]);

  return { maxAmount, isEstimating: isNativeEvmAsset && fee === undefined };
};

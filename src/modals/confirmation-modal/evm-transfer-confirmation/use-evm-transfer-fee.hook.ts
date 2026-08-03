import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatGwei, parseGwei } from 'viem';

import { useEtherlinkPublicClient } from 'src/hooks/evm/use-etherlink-public-client.hook';
import { SendAsset } from 'src/modals/send-modal/send-asset.types';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';
import { getDollarValue } from 'src/utils/balance.utils';
import { EvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { formatNetworkFee, getGasPriceForNetworkFee, getNetworkFeeSliderValues } from './evm-transfer-fee.utils';

interface Props {
  sourceAddress?: HexString;
  request?: EvmTransferRequest;
  asset: SendAsset;
  atomicAmount: string;
}

export const useEvmTransferFee = ({ sourceAddress, request, asset, atomicAmount }: Props) => {
  const publicClient = useEtherlinkPublicClient();
  const balances = useEvmAccountChainBalancesSelector(sourceAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const evmExchangeRates = useEvmChainExchangeRatesSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const fiatToUsdRate = useFiatToUsdRateSelector();

  const [gasLimit, setGasLimit] = useState<bigint>();
  const [estimatedGasPrice, setEstimatedGasPrice] = useState<bigint>();
  const [isDetailedInputVisible, setIsDetailedInputVisible] = useState(false);
  const [gasPriceInput, setGasPriceInput] = useState('');
  const [isEstimating, setIsEstimating] = useState(true);
  const [estimationError, setEstimationError] = useState<string>();

  useEffect(() => {
    let isActive = true;

    const estimate = async () => {
      if (!sourceAddress || !request) {
        setEstimationError('Etherlink source account is unavailable');
        setIsEstimating(false);

        return;
      }

      setIsEstimating(true);
      setEstimationError(undefined);

      try {
        const [nextGasLimit, nextGasPrice] = await Promise.all([
          publicClient.estimateGas({ account: sourceAddress, ...request }),
          publicClient.getGasPrice()
        ]);

        if (isActive) {
          setGasLimit(nextGasLimit);
          setEstimatedGasPrice(nextGasPrice);
          setGasPriceInput(formatGwei(nextGasPrice));
        }
      } catch (error) {
        if (isActive) {
          setEstimationError(error instanceof Error ? error.message : 'Unable to estimate Etherlink fee');
        }
      } finally {
        if (isActive) {
          setIsEstimating(false);
        }
      }
    };

    void estimate();

    return () => {
      isActive = false;
    };
  }, [publicClient, request, sourceAddress]);

  const selectedGasPrice = useMemo(() => {
    try {
      const parsed = parseGwei(gasPriceInput);

      return parsed > 0n ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, [gasPriceInput]);

  const fee = gasLimit && selectedGasPrice ? gasLimit * selectedGasPrice : undefined;
  const estimatedFee = gasLimit && estimatedGasPrice ? gasLimit * estimatedGasPrice : undefined;
  const slider = useMemo(() => getNetworkFeeSliderValues(estimatedFee, fee), [estimatedFee, fee]);
  const feeAsset = useMemo(
    () => ({
      ...asset,
      name: ETHERLINK_MAINNET_CHAIN_SPECS.currency.name,
      symbol: ETHERLINK_MAINNET_CHAIN_SPECS.currency.symbol,
      decimals: ETHERLINK_MAINNET_CHAIN_SPECS.currency.decimals,
      balance: fee?.toString() ?? '0',
      exchangeRate:
        evmExchangeRates[EVM_TOKEN_SLUG] !== undefined && fiatToUsdRate !== undefined
          ? evmExchangeRates[EVM_TOKEN_SLUG] * fiatToUsdRate
          : undefined
    }),
    [asset, evmExchangeRates, fee, fiatToUsdRate]
  );
  const feeFiatValue = useMemo(
    () => getDollarValue(feeAsset.balance, feeAsset.decimals, feeAsset.exchangeRate),
    [feeAsset.balance, feeAsset.decimals, feeAsset.exchangeRate]
  );
  const requiredNativeBalance = fee
    ? fee + (asset.sendStandard === EvmAssetStandardEnum.NATIVE ? BigInt(atomicAmount) : 0n)
    : undefined;
  const hasInsufficientNativeBalance =
    requiredNativeBalance !== undefined && requiredNativeBalance > BigInt(balances[EVM_TOKEN_SLUG] ?? '0');

  const handleSliderValueChange = useCallback(
    (value: number) => {
      if (gasLimit) {
        setGasPriceInput(formatGwei(getGasPriceForNetworkFee(value, gasLimit)));
      }
    },
    [gasLimit]
  );
  const toggleDetailedInput = useCallback(() => setIsDetailedInputVisible(value => !value), []);

  return {
    estimationError,
    fee,
    feeAsset,
    feeFiatValue,
    formattedFee: fee ? formatNetworkFee(fee) : undefined,
    gasLimit,
    gasPriceInput,
    handleGasPriceInputChange: setGasPriceInput,
    handleSliderValueChange,
    hasInsufficientNativeBalance,
    isDetailedInputVisible,
    isEstimating,
    isSliderAvailable: estimatedFee !== undefined && fee !== undefined,
    selectedGasPrice,
    slider,
    toggleDetailedInput
  };
};

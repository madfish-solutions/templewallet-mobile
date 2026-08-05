import { useCallback, useMemo, useState } from 'react';

import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useViemPublicClient } from 'src/hooks/evm/use-viem-public-client.hook';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { EvmSendAsset } from 'src/types/send-asset';
import { getDollarValue } from 'src/utils/balance.utils';
import { EvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';

import {
  formatNetworkFee,
  getEvmFeeOptions,
  getEvmFeesForGasPrice,
  getNetworkFeeSliderValues
} from '../evm-transfer-fee.utils';

import { useEvmTransferEstimation } from './use-evm-transfer-estimation';

interface Props {
  sourceAddress?: HexString;
  request?: EvmTransferRequest;
  asset: EvmSendAsset;
  atomicAmount: string;
}

export const useEvmTransferFee = ({ sourceAddress, request, asset, atomicAmount }: Props) => {
  const chain = useEvmChain(asset.chainId);
  const publicClient = useViemPublicClient(asset.chainId);
  const balances = useEvmAccountChainBalancesSelector(sourceAddress, asset.chainId);
  const evmExchangeRates = useEvmChainExchangeRatesSelector(asset.chainId);
  const fiatToUsdRate = useFiatToUsdRateSelector();
  const [isDetailedInputVisible, setIsDetailedInputVisible] = useState(false);
  const estimationState = useEvmTransferEstimation({ sourceAddress, request, publicClient });
  const { estimation, gasPriceInput, selectedGasPrice } = estimationState;

  const feeOptions = useMemo(() => (estimation ? getEvmFeeOptions(estimation) : undefined), [estimation]);
  const selectedFees = useMemo(() => {
    if (!estimation || !feeOptions || !selectedGasPrice) return undefined;

    const minimumGasPrice = feeOptions.slow.type === 'legacy' ? feeOptions.slow.gasPrice : feeOptions.slow.maxFeePerGas;
    if (selectedGasPrice < minimumGasPrice) return undefined;

    return getEvmFeesForGasPrice(selectedGasPrice, estimation);
  }, [estimation, feeOptions, selectedGasPrice]);
  const fee = estimation && selectedGasPrice ? estimation.gas * selectedGasPrice : undefined;
  const gasPriceError = useMemo(() => {
    if (!gasPriceInput || !estimation || !feeOptions) return undefined;
    if (!selectedGasPrice) return 'Enter a valid gas price';

    const minimumGasPrice = feeOptions.slow.type === 'legacy' ? feeOptions.slow.gasPrice : feeOptions.slow.maxFeePerGas;
    if (selectedGasPrice < minimumGasPrice) return 'Gas price is too low';

    return undefined;
  }, [estimation, feeOptions, gasPriceInput, selectedGasPrice]);
  const slider = useMemo(
    () => getNetworkFeeSliderValues(feeOptions?.slow.fee, feeOptions?.fast.fee, fee),
    [fee, feeOptions]
  );
  const feeAsset = useMemo(
    () => ({
      ...asset,
      name: chain?.currency.name ?? asset.networkName,
      symbol: chain?.currency.symbol ?? asset.symbol,
      decimals: chain?.currency.decimals ?? asset.decimals,
      balance: fee?.toString() ?? '0',
      exchangeRate:
        evmExchangeRates[EVM_TOKEN_SLUG] !== undefined && fiatToUsdRate !== undefined
          ? evmExchangeRates[EVM_TOKEN_SLUG] * fiatToUsdRate
          : undefined
    }),
    [asset, chain, evmExchangeRates, fee, fiatToUsdRate]
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

  const toggleDetailedInput = useCallback(() => setIsDetailedInputVisible(value => !value), []);

  return {
    estimationError: estimationState.estimationError,
    fee,
    feeAsset,
    feeFiatValue,
    formattedFee: fee ? formatNetworkFee(fee) : undefined,
    gasLimit: estimation?.gas,
    gasPriceError,
    gasPriceInput,
    getSubmissionFees: estimationState.getSubmissionFees,
    handleGasPriceInputChange: estimationState.handleGasPriceInputChange,
    handleSliderValueChange: estimationState.handleSliderValueChange,
    hasInsufficientNativeBalance,
    isDetailedInputVisible,
    isEstimating: estimationState.isEstimating,
    isSliderAvailable: feeOptions !== undefined && fee !== undefined,
    retry: estimationState.retry,
    selectedFees,
    slider,
    toggleDetailedInput
  };
};

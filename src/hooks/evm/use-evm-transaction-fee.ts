import { useCallback, useMemo, useState } from 'react';

import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useViemPublicClient } from 'src/hooks/evm/use-viem-public-client.hook';
import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmAssetExchangeRate } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { getDollarValue } from 'src/utils/balance.utils';
import {
  formatNetworkFee,
  getEvmFeeOptions,
  getEvmFeesForGasPrice,
  getNetworkFeeSliderValues,
  resolveEvmGasLimit
} from 'src/utils/evm/evm-transaction-fee.utils';

import { useEvmTransactionEstimation } from './use-evm-transaction-estimation';

interface NativeCurrencyFallback {
  name: string;
  symbol: string;
  decimals: number;
}

interface Props {
  chainId: number;
  sourceAddress?: HexString;
  request?: EvmTransactionRequest;
  nativeCurrencyFallback?: NativeCurrencyFallback;
}

export const useEvmTransactionFee = ({ chainId, sourceAddress, request, nativeCurrencyFallback }: Props) => {
  const chain = useEvmChain(chainId);
  const publicClient = useViemPublicClient(chainId);
  const balances = useEvmAccountChainBalancesSelector(sourceAddress, chainId);
  const nativeExchangeRate = useEvmAssetExchangeRate(chainId, EVM_TOKEN_SLUG);
  const [isDetailedInputVisible, setIsDetailedInputVisible] = useState(false);
  const estimationState = useEvmTransactionEstimation({ sourceAddress, request, publicClient });
  const { estimation, gasPriceInput, selectedGasPrice } = estimationState;

  const feeOptions = useMemo(() => (estimation ? getEvmFeeOptions(estimation) : undefined), [estimation]);
  const selectedFees = useMemo(() => {
    if (!estimation || !feeOptions || !selectedGasPrice) return undefined;

    const minimumGasPrice = feeOptions.slow.type === 'legacy' ? feeOptions.slow.gasPrice : feeOptions.slow.maxFeePerGas;
    if (selectedGasPrice < minimumGasPrice) return undefined;

    return getEvmFeesForGasPrice(selectedGasPrice, estimation);
  }, [estimation, feeOptions, selectedGasPrice]);
  const gasLimit = estimation?.gas !== undefined ? resolveEvmGasLimit(estimation.gas, request?.gas) : undefined;
  const fee = gasLimit !== undefined && selectedGasPrice ? gasLimit * selectedGasPrice : undefined;
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
      name: chain?.currency.name ?? nativeCurrencyFallback?.name ?? 'Native token',
      symbol: chain?.currency.symbol ?? nativeCurrencyFallback?.symbol ?? '???',
      decimals: chain?.currency.decimals ?? nativeCurrencyFallback?.decimals ?? 18,
      balance: fee?.toString() ?? '0',
      exchangeRate: nativeExchangeRate
    }),
    [chain, fee, nativeCurrencyFallback, nativeExchangeRate]
  );
  const feeFiatValue = useMemo(
    () => getDollarValue(feeAsset.balance, feeAsset.decimals, feeAsset.exchangeRate),
    [feeAsset.balance, feeAsset.decimals, feeAsset.exchangeRate]
  );
  const requiredNativeBalance = fee !== undefined ? fee + (request?.value ?? 0n) : undefined;
  const hasInsufficientNativeBalance =
    requiredNativeBalance !== undefined && requiredNativeBalance > BigInt(balances[EVM_TOKEN_SLUG] ?? '0');

  const toggleDetailedInput = useCallback(() => setIsDetailedInputVisible(value => !value), []);

  return {
    estimationError: estimationState.estimationError,
    fee,
    feeAsset,
    feeFiatValue,
    formattedFee: fee ? formatNetworkFee(fee) : undefined,
    gasLimit,
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

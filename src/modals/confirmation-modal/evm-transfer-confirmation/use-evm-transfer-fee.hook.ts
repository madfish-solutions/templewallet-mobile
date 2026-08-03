import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatGwei, parseGwei } from 'viem';

import { useEvmPublicClient } from 'src/hooks/evm/use-etherlink-public-client.hook';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { EvmSendAsset } from 'src/types/send-asset';
import { getDollarValue } from 'src/utils/balance.utils';
import { EvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';
import { EvmEstimation, estimateEvmTransaction } from 'src/utils/evm/estimate-evm-transaction';
import { EvmTransactionError, normalizeEvmTransactionError } from 'src/utils/evm/evm-transaction-error';

import {
  formatNetworkFee,
  getEvmFeeOptions,
  getEvmFeesForGasPrice,
  getGasPriceForNetworkFee,
  getNetworkFeeSliderValues
} from './evm-transfer-fee.utils';

interface Props {
  sourceAddress?: HexString;
  request?: EvmTransferRequest;
  asset: EvmSendAsset;
  atomicAmount: string;
}

type EstimationState =
  | { status: 'loading' }
  | { status: 'success'; data: EvmEstimation }
  | { status: 'error'; error: EvmTransactionError };

export const useEvmTransferFee = ({ sourceAddress, request, asset, atomicAmount }: Props) => {
  const chain = useEvmChain(asset.chainId);
  const publicClient = useEvmPublicClient(asset.chainId);
  const balances = useEvmAccountChainBalancesSelector(sourceAddress, asset.chainId);
  const evmExchangeRates = useEvmChainExchangeRatesSelector(asset.chainId);
  const fiatToUsdRate = useFiatToUsdRateSelector();

  const [estimationState, setEstimationState] = useState<EstimationState>({ status: 'loading' });
  const [isDetailedInputVisible, setIsDetailedInputVisible] = useState(false);
  const [gasPriceInput, setGasPriceInput] = useState('');
  const [retryIndex, setRetryIndex] = useState(0);
  const estimation = estimationState.status === 'success' ? estimationState.data : undefined;
  const estimationError = estimationState.status === 'error' ? estimationState.error : undefined;

  useEffect(() => {
    let isActive = true;

    const estimate = async () => {
      if (!sourceAddress || !request || !publicClient) {
        setEstimationState({
          status: 'error',
          error: normalizeEvmTransactionError(new Error('EVM account or network is unavailable'))
        });

        return;
      }

      setEstimationState({ status: 'loading' });
      setGasPriceInput('');

      try {
        const nextEstimation = await estimateEvmTransaction(publicClient, sourceAddress, request);

        if (isActive) {
          setEstimationState({ status: 'success', data: nextEstimation });
          setGasPriceInput(
            formatGwei(nextEstimation.type === 'legacy' ? nextEstimation.gasPrice : nextEstimation.maxFeePerGas)
          );
        }
      } catch (error) {
        if (isActive) {
          setEstimationState({ status: 'error', error: normalizeEvmTransactionError(error) });
        }
      }
    };

    void estimate();

    return () => {
      isActive = false;
    };
  }, [publicClient, request, retryIndex, sourceAddress]);

  const selectedGasPrice = useMemo(() => {
    try {
      const parsed = parseGwei(gasPriceInput);

      return parsed > 0n ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, [gasPriceInput]);

  const feeOptions = useMemo(() => (estimation ? getEvmFeeOptions(estimation) : undefined), [estimation]);
  const selectedFees = useMemo(() => {
    if (!estimation || !feeOptions || !selectedGasPrice) {
      return undefined;
    }

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

  const handleSliderValueChange = useCallback(
    (value: number) => {
      if (estimation) {
        setGasPriceInput(formatGwei(getGasPriceForNetworkFee(value, estimation.gas)));
      }
    },
    [estimation]
  );
  const toggleDetailedInput = useCallback(() => setIsDetailedInputVisible(value => !value), []);
  const retry = useCallback(() => {
    setEstimationState({ status: 'loading' });
    setRetryIndex(value => value + 1);
  }, []);

  return {
    estimationError,
    fee,
    feeAsset,
    feeFiatValue,
    formattedFee: fee ? formatNetworkFee(fee) : undefined,
    gasLimit: estimation?.gas,
    gasPriceError,
    gasPriceInput,
    handleGasPriceInputChange: setGasPriceInput,
    handleSliderValueChange,
    hasInsufficientNativeBalance,
    isDetailedInputVisible,
    isEstimating: estimationState.status === 'loading',
    isSliderAvailable: feeOptions !== undefined && fee !== undefined,
    retry,
    selectedFees,
    slider,
    toggleDetailedInput
  };
};

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatGwei, parseGwei } from 'viem';

import { useAppStateStatus } from 'src/hooks/use-app-state-status.hook';
import { EvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';
import {
  EvmEstimation,
  EvmFees,
  EvmTransactionPreparer,
  estimateEvmTransaction
} from 'src/utils/evm/estimate-evm-transaction';
import { EvmTransactionError, normalizeEvmTransactionError } from 'src/utils/evm/evm-transaction-error';

import { getEvmFeeOptions, getEvmFeesForGasPrice, getGasPriceForNetworkFee } from './evm-transfer-fee.utils';

export const EVM_ESTIMATION_REFRESH_INTERVAL = 10_000;

export interface EvmSubmissionFees {
  gasLimit: bigint;
  fees: EvmFees;
}

interface Props {
  sourceAddress?: HexString;
  request?: EvmTransferRequest;
  publicClient?: EvmTransactionPreparer;
}

const getEstimatedGasPrice = (estimation: EvmEstimation) =>
  estimation.type === 'legacy' ? estimation.gasPrice : estimation.maxFeePerGas;

const parsePositiveGasPrice = (value: string) => {
  try {
    const parsed = parseGwei(value);

    return parsed > 0n ? parsed : undefined;
  } catch {
    return undefined;
  }
};

export const useEvmTransferEstimation = ({ sourceAddress, request, publicClient }: Props) => {
  const [estimation, setEstimation] = useState<EvmEstimation>();
  const [estimationError, setEstimationError] = useState<EvmTransactionError>();
  const [isEstimating, setIsEstimating] = useState(true);
  const [gasPriceInput, setGasPriceInput] = useState('');
  const [isGasPriceCustomized, setIsGasPriceCustomized] = useState(false);
  const estimationRef = useRef<EvmEstimation | undefined>(undefined);
  const gasPriceInputRef = useRef('');
  const isGasPriceCustomizedRef = useRef(false);
  const estimatedAtRef = useRef(0);
  const estimationRequestIdRef = useRef(0);
  const estimationPromiseRef = useRef<Promise<EvmEstimation | undefined> | undefined>(undefined);

  const runEstimation = useCallback(
    (automaticOnly = false): Promise<EvmEstimation | undefined> => {
      if (automaticOnly && isGasPriceCustomizedRef.current) {
        return Promise.resolve(estimationRef.current);
      }

      if (estimationPromiseRef.current) {
        return estimationPromiseRef.current;
      }

      const requestId = ++estimationRequestIdRef.current;
      const promise = (async () => {
        if (!sourceAddress || !request || !publicClient) {
          const error = normalizeEvmTransactionError(new Error('EVM account or network is unavailable'));

          if (requestId === estimationRequestIdRef.current) {
            setEstimationError(error);
            setIsEstimating(false);
          }

          return undefined;
        }

        setIsEstimating(true);
        setEstimationError(undefined);

        try {
          const nextEstimation = await estimateEvmTransaction(publicClient, sourceAddress, request);

          if (requestId !== estimationRequestIdRef.current) {
            return undefined;
          }

          if (automaticOnly && isGasPriceCustomizedRef.current) {
            return estimationRef.current;
          }

          estimationRef.current = nextEstimation;
          estimatedAtRef.current = Date.now();
          setEstimation(nextEstimation);

          if (!isGasPriceCustomizedRef.current) {
            const nextGasPriceInput = formatGwei(getEstimatedGasPrice(nextEstimation));

            gasPriceInputRef.current = nextGasPriceInput;
            setGasPriceInput(nextGasPriceInput);
          }

          return nextEstimation;
        } catch (error) {
          if (requestId === estimationRequestIdRef.current) {
            setEstimationError(normalizeEvmTransactionError(error));
          }

          return undefined;
        } finally {
          if (requestId === estimationRequestIdRef.current) {
            setIsEstimating(false);
          }
        }
      })();

      estimationPromiseRef.current = promise;
      void promise.then(
        () => {
          if (estimationPromiseRef.current === promise) estimationPromiseRef.current = undefined;
        },
        () => {
          if (estimationPromiseRef.current === promise) estimationPromiseRef.current = undefined;
        }
      );

      return promise;
    },
    [publicClient, request, sourceAddress]
  );

  const runEstimationRef = useRef(runEstimation);
  runEstimationRef.current = runEstimation;

  useEffect(() => {
    isGasPriceCustomizedRef.current = false;
    estimationRef.current = undefined;
    gasPriceInputRef.current = '';
    estimatedAtRef.current = 0;
    setIsGasPriceCustomized(false);
    setEstimation(undefined);
    setGasPriceInput('');

    void runEstimation();

    return () => {
      estimationRequestIdRef.current += 1;
      estimationPromiseRef.current = undefined;
    };
  }, [runEstimation]);

  useEffect(() => {
    if (isGasPriceCustomized) return;

    const interval = setInterval(() => void runEstimation(true), EVM_ESTIMATION_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isGasPriceCustomized, runEstimation]);

  useAppStateStatus({
    onAppActiveState: () => {
      if (!isGasPriceCustomizedRef.current && Date.now() - estimatedAtRef.current >= EVM_ESTIMATION_REFRESH_INTERVAL) {
        void runEstimationRef.current(true);
      }
    }
  });

  const selectedGasPrice = useMemo(() => parsePositiveGasPrice(gasPriceInput), [gasPriceInput]);
  const handleSliderValueChange = useCallback(
    (value: number) => {
      if (!estimation) return;

      const nextGasPriceInput = formatGwei(getGasPriceForNetworkFee(value, estimation.gas));

      isGasPriceCustomizedRef.current = true;
      gasPriceInputRef.current = nextGasPriceInput;
      setIsGasPriceCustomized(true);
      setGasPriceInput(nextGasPriceInput);
    },
    [estimation]
  );
  const handleGasPriceInputChange = useCallback((value: string) => {
    isGasPriceCustomizedRef.current = true;
    gasPriceInputRef.current = value;
    setIsGasPriceCustomized(true);
    setGasPriceInput(value);
  }, []);
  const retry = useCallback(
    () => (isGasPriceCustomizedRef.current ? Promise.resolve(estimationRef.current) : runEstimation(true)),
    [runEstimation]
  );
  const getSubmissionFees = useCallback(async (): Promise<EvmSubmissionFees | undefined> => {
    let latestEstimation = estimationRef.current;

    if (!isGasPriceCustomizedRef.current && Date.now() - estimatedAtRef.current >= EVM_ESTIMATION_REFRESH_INTERVAL) {
      latestEstimation = await runEstimation(true);
    }

    const latestGasPrice = parsePositiveGasPrice(gasPriceInputRef.current);
    if (!latestEstimation || !latestGasPrice) return undefined;

    const latestFeeOptions = getEvmFeeOptions(latestEstimation);
    const minimumGasPrice =
      latestFeeOptions.slow.type === 'legacy' ? latestFeeOptions.slow.gasPrice : latestFeeOptions.slow.maxFeePerGas;
    if (latestGasPrice < minimumGasPrice) return undefined;

    return {
      gasLimit: latestEstimation.gas,
      fees: getEvmFeesForGasPrice(latestGasPrice, latestEstimation)
    };
  }, [runEstimation]);

  return {
    estimation,
    estimationError,
    gasPriceInput,
    getSubmissionFees,
    handleGasPriceInputChange,
    handleSliderValueChange,
    isEstimating,
    retry,
    selectedGasPrice
  };
};

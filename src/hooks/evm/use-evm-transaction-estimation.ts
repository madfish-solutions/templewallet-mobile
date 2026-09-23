import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatGwei, parseGwei } from 'viem';

import { useAppStateStatus } from 'src/hooks/use-app-state-status.hook';
import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';
import {
  EvmEstimation,
  EvmSubmissionFees,
  EvmTransactionPreparer,
  estimateEvmTransaction
} from 'src/utils/evm/estimate-evm-transaction';
import { EvmTransactionError, normalizeEvmTransactionError } from 'src/utils/evm/evm-transaction-error';
import {
  getEvmFeeOptions,
  getGasPriceForNetworkFee,
  resolveEvmGasLimit,
  resolveEvmSubmissionFees
} from 'src/utils/evm/evm-transaction-fee.utils';
import { isDefined } from 'src/utils/is-defined';

const EVM_ESTIMATION_REFRESH_INTERVAL = 15_000;

interface Props {
  sourceAddress?: HexString;
  request?: EvmTransactionRequest;
  publicClient?: EvmTransactionPreparer;
}

const getEstimatedGasPrice = (estimation: EvmEstimation) =>
  estimation.type === 'legacy' ? estimation.gasPrice : estimation.maxFeePerGas;

const getProvidedGasPrice = (request?: EvmTransactionRequest) => {
  if (!request) return undefined;
  if (isDefined(request.maxFeePerGas) && request.maxFeePerGas > 0n) return request.maxFeePerGas;
  if (isDefined(request.gasPrice) && request.gasPrice > 0n) return request.gasPrice;

  return undefined;
};

const parsePositiveGasPrice = (value: string) => {
  try {
    const parsed = parseGwei(value);

    return parsed > 0n ? parsed : undefined;
  } catch {
    return undefined;
  }
};

export const useEvmTransactionEstimation = ({ sourceAddress, request, publicClient }: Props) => {
  const [estimation, setEstimation] = useState<EvmEstimation>();
  const [estimationError, setEstimationError] = useState<EvmTransactionError>();
  const [isEstimating, setIsEstimating] = useState(true);
  const [gasPriceInput, setGasPriceInput] = useState('');
  const estimationRef = useRef<EvmEstimation | undefined>(undefined);
  const gasPriceInputRef = useRef('');
  const isGasPriceCustomizedRef = useRef(false);
  const estimatedAtRef = useRef(0);
  const estimationRequestIdRef = useRef(0);
  const estimationPromiseRef = useRef<Promise<EvmEstimation | undefined> | undefined>(undefined);
  const requestRef = useRef(request);
  requestRef.current = request;

  const runEstimation = useCallback((): Promise<EvmEstimation | undefined> => {
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

        estimationRef.current = nextEstimation;
        estimatedAtRef.current = Date.now();
        setEstimation(nextEstimation);

        if (!isGasPriceCustomizedRef.current) {
          const providedGasPrice = getProvidedGasPrice(request);
          const nextGasPriceInput = formatGwei(providedGasPrice ?? getEstimatedGasPrice(nextEstimation));

          gasPriceInputRef.current = nextGasPriceInput;
          setGasPriceInput(nextGasPriceInput);

          if (isDefined(providedGasPrice)) {
            isGasPriceCustomizedRef.current = true;
          }
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
  }, [publicClient, request, sourceAddress]);

  const runEstimationRef = useRef(runEstimation);
  runEstimationRef.current = runEstimation;

  useEffect(() => {
    isGasPriceCustomizedRef.current = false;
    estimationRef.current = undefined;
    gasPriceInputRef.current = '';
    estimatedAtRef.current = 0;
    setEstimation(undefined);
    setGasPriceInput('');

    void runEstimation();

    return () => {
      estimationRequestIdRef.current += 1;
      estimationPromiseRef.current = undefined;
    };
  }, [runEstimation]);

  useEffect(() => {
    const interval = setInterval(() => void runEstimation(), EVM_ESTIMATION_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [runEstimation]);

  useAppStateStatus({
    onAppActiveState: () => {
      if (Date.now() - estimatedAtRef.current >= EVM_ESTIMATION_REFRESH_INTERVAL) {
        void runEstimationRef.current();
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
      setGasPriceInput(nextGasPriceInput);
    },
    [estimation]
  );
  const handleGasPriceInputChange = useCallback((value: string) => {
    isGasPriceCustomizedRef.current = true;
    gasPriceInputRef.current = value;
    setGasPriceInput(value);
  }, []);
  const retry = useCallback(
    () => (isGasPriceCustomizedRef.current ? Promise.resolve(estimationRef.current) : runEstimation()),
    [runEstimation]
  );
  const getSubmissionFees = useCallback(async (): Promise<EvmSubmissionFees | undefined> => {
    let latestEstimation = estimationRef.current;

    if (Date.now() - estimatedAtRef.current >= EVM_ESTIMATION_REFRESH_INTERVAL) {
      latestEstimation = await runEstimation();
    }

    const latestGasPrice = parsePositiveGasPrice(gasPriceInputRef.current);
    if (!latestEstimation || !latestGasPrice) return undefined;

    const latestFeeOptions = getEvmFeeOptions(latestEstimation);
    const minimumGasPrice =
      latestFeeOptions.slow.type === 'legacy' ? latestFeeOptions.slow.gasPrice : latestFeeOptions.slow.maxFeePerGas;
    if (latestGasPrice < minimumGasPrice) return undefined;

    const latestRequest = requestRef.current;

    return {
      gasLimit: resolveEvmGasLimit(latestEstimation.gas, latestRequest?.gas),
      fees: resolveEvmSubmissionFees(latestGasPrice, latestEstimation, latestRequest)
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

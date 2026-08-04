import { act, renderHook } from '@testing-library/react-hooks';
import { formatGwei } from 'viem';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useAppStateStatus } from 'src/hooks/use-app-state-status.hook';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmNativeSendAsset } from 'src/types/send-asset';
import { Eip1559Estimation } from 'src/utils/evm/estimate-evm-transaction';

import { EVM_ESTIMATION_REFRESH_INTERVAL, EvmSubmissionFees, useEvmTransferFee } from './use-evm-transfer-fee.hook';

const mockEstimateEvmTransaction = jest.fn();
const mockUseAppStateStatus = useAppStateStatus as jest.Mock;

jest.mock('src/hooks/evm/use-viem-public-client.hook', () => {
  const publicClient = {};

  return { useViemPublicClient: jest.fn(() => publicClient) };
});
jest.mock('src/hooks/evm/use-evm-chains.hook', () => {
  const chain = { currency: { name: 'Tezos', symbol: 'XTZ', decimals: 18 } };

  return { useEvmChain: jest.fn(() => chain) };
});
jest.mock('src/hooks/use-app-state-status.hook', () => ({ useAppStateStatus: jest.fn() }));
jest.mock('src/store/evm/balances/evm-balances-selectors', () => ({
  useEvmAccountChainBalancesSelector: jest.fn(() => ({ eth: '100000000000000000000' }))
}));
jest.mock('src/store/evm/exchange-rates/evm-exchange-rates-selectors', () => ({
  useEvmChainExchangeRatesSelector: jest.fn(() => ({}))
}));
jest.mock('src/store/settings/settings-selectors', () => ({ useFiatToUsdRateSelector: jest.fn() }));
jest.mock('src/utils/evm/estimate-evm-transaction', () => ({
  ...jest.requireActual('src/utils/evm/estimate-evm-transaction'),
  estimateEvmTransaction: (...args: unknown[]) => mockEstimateEvmTransaction(...args)
}));

const SOURCE_ADDRESS = '0x1111111111111111111111111111111111111111';
const REQUEST = { to: '0x2222222222222222222222222222222222222222', value: 1n } as const;
const ASSET: EvmNativeSendAsset = {
  name: 'Etherlink XTZ',
  symbol: 'XTZ',
  decimals: 18,
  balance: '100000000000000000000',
  assetKey: 'evm:42793:eth',
  assetSlug: 'eth',
  chainKind: TempleChainKind.EVM,
  chainId: 42793,
  networkName: 'Etherlink',
  sendStandard: EvmAssetStandardEnum.NATIVE
};

const makeEstimation = (maxFeePerGas: bigint): Eip1559Estimation => ({
  type: 'eip1559',
  gas: 21_000n,
  maxFeePerGas,
  maxPriorityFeePerGas: maxFeePerGas / 5n,
  estimatedFee: 21_000n * maxFeePerGas
});

const renderFeeHook = () =>
  renderHook(() =>
    useEvmTransferFee({ sourceAddress: SOURCE_ADDRESS, request: REQUEST, asset: ASSET, atomicAmount: '1' })
  );

const flushEstimation = () =>
  act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

describe('useEvmTransferFee', () => {
  let refreshIntervalCallback: () => void;
  let nowSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    jest.spyOn(global, 'setInterval').mockImplementation(callback => {
      refreshIntervalCallback = callback as () => void;

      return 1 as unknown as NodeJS.Timeout;
    });
    jest.spyOn(global, 'clearInterval').mockImplementation();
    nowSpy = jest.spyOn(Date, 'now').mockReturnValue(0);
    mockEstimateEvmTransaction.mockReset().mockResolvedValue(makeEstimation(100n));
    mockUseAppStateStatus.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('refreshes an automatic estimation every ten seconds', async () => {
    const { result, unmount } = renderFeeHook();
    await flushEstimation();
    expect(result.current.isEstimating).toBe(false);

    act(() => refreshIntervalCallback());
    await flushEstimation();

    expect(mockEstimateEvmTransaction).toHaveBeenCalledTimes(2);
    unmount();
  });

  it('stops refreshing and preserves a custom gas price', async () => {
    const { result, unmount } = renderFeeHook();
    await flushEstimation();
    expect(result.current.isEstimating).toBe(false);

    act(() => result.current.handleGasPriceInputChange(formatGwei(120n)));
    act(() => {
      refreshIntervalCallback();
      refreshIntervalCallback();
      refreshIntervalCallback();
    });
    await flushEstimation();
    const submissionFees = await result.current.getSubmissionFees();

    expect(mockEstimateEvmTransaction).toHaveBeenCalledTimes(1);
    expect(result.current.gasPriceInput).toBe(formatGwei(120n));
    expect(submissionFees?.fees).toEqual({
      type: 'eip1559',
      maxFeePerGas: 120n,
      maxPriorityFeePerGas: 24n
    });
    unmount();
  });

  it('refreshes stale automatic fees when the app returns to the foreground', async () => {
    const { result, unmount } = renderFeeHook();
    await flushEstimation();
    expect(result.current.isEstimating).toBe(false);

    nowSpy.mockReturnValue(EVM_ESTIMATION_REFRESH_INTERVAL + 1);
    const { onAppActiveState } = mockUseAppStateStatus.mock.calls.at(-1)[0];
    act(() => onAppActiveState());
    await flushEstimation();

    expect(mockEstimateEvmTransaction).toHaveBeenCalledTimes(2);
    unmount();
  });

  it('refreshes stale automatic fees before returning submission parameters', async () => {
    mockEstimateEvmTransaction.mockResolvedValueOnce(makeEstimation(100n)).mockResolvedValueOnce(makeEstimation(200n));
    const { result, unmount } = renderFeeHook();
    await flushEstimation();
    expect(result.current.isEstimating).toBe(false);

    nowSpy.mockReturnValue(EVM_ESTIMATION_REFRESH_INTERVAL + 1);
    let submissionFees: EvmSubmissionFees | undefined;
    await act(async () => {
      submissionFees = await result.current.getSubmissionFees();
    });

    expect(mockEstimateEvmTransaction).toHaveBeenCalledTimes(2);
    expect(submissionFees).toEqual({
      gasLimit: 21_000n,
      fees: { type: 'eip1559', maxFeePerGas: 200n, maxPriorityFeePerGas: 40n }
    });
    unmount();
  });
});

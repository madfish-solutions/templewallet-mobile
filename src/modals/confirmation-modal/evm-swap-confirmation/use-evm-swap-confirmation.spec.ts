import { act, renderHook } from '@testing-library/react-native';
import { AppState, AppStateStatus } from 'react-native';
import { TransactionReceipt } from 'viem';

import { get3RouteEvmSwap } from 'src/apis/temple-wallet/evm-swap';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useEvmTransactionFee } from 'src/hooks/evm/use-evm-transaction-fee';
import { useViemPublicClient } from 'src/hooks/evm/use-viem-public-client.hook';
import { Account } from 'src/interfaces/account.interfaces';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { store } from 'src/store';
import { useAllAccounts, useCurrentAccountId } from 'src/store/wallet/wallet-selectors';
import { EvmSwapQuote } from 'src/types/evm-swap';
import { evmTransactionSubmissionService } from 'src/utils/evm/evm-transaction-submission';
import { EvmTransactionSubmissionError } from 'src/utils/evm/evm-transaction-submission-error';
import { refreshSwapBalances } from 'src/utils/evm/refresh-swap-balances';
import {
  SWAP_ERC20_ASSET,
  SWAP_ERC20_QUOTE,
  SWAP_NATIVE_ASSET,
  SWAP_OWNER,
  SWAP_QUOTE,
  SWAP_ROUTER
} from 'src/utils/evm/swap.mock';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { EvmSwapConfirmationModalParams } from '../confirmation-modal.params';

import { useEvmSwapConfirmation } from './use-evm-swap-confirmation';

jest.mock('src/api.service', () => ({ templeWalletApi: { get: jest.fn() } }));
jest.mock('src/store', () => ({ store: { getState: jest.fn() } }));
jest.mock('src/store/wallet/wallet-selectors', () => ({ useAllAccounts: jest.fn(), useCurrentAccountId: jest.fn() }));
jest.mock('src/hooks/evm/use-evm-chains.hook', () => ({ useEvmChain: jest.fn() }));
jest.mock('src/hooks/evm/use-viem-public-client.hook', () => ({ useViemPublicClient: jest.fn() }));
jest.mock('src/hooks/evm/use-evm-transaction-fee', () => ({ useEvmTransactionFee: jest.fn() }));
jest.mock('src/apis/temple-wallet/evm-swap', () => ({
  ...jest.requireActual('src/apis/temple-wallet/evm-swap'),
  get3RouteEvmSwap: jest.fn()
}));
jest.mock('src/utils/evm/evm-transaction-submission', () => ({
  evmTransactionSubmissionService: { submit: jest.fn(), waitForConfirmation: jest.fn() }
}));
jest.mock('src/utils/evm/refresh-swap-balances', () => ({ refreshSwapBalances: jest.fn() }));

const account: Account = {
  id: 'swap-account',
  name: 'Swap account',
  type: AccountTypeEnum.IMPORTED_CHAIN,
  chain: TempleChainKind.EVM,
  address: SWAP_OWNER,
  publicKey: ''
};
const receipt: TransactionReceipt = {
  transactionHash: '0xabcdef',
  blockHash: '0xabcdef',
  blockNumber: 1n,
  transactionIndex: 0,
  from: SWAP_OWNER,
  to: SWAP_ROUTER,
  cumulativeGasUsed: 1n,
  gasUsed: 1n,
  effectiveGasPrice: 1n,
  contractAddress: null,
  logs: [],
  logsBloom: '0x',
  status: 'success',
  type: 'legacy'
};
const rpc = { readContract: jest.fn(), getBalance: jest.fn() };
const submit = jest.mocked(evmTransactionSubmissionService.submit);
const status = jest.mocked(evmTransactionSubmissionService.waitForConfirmation);
const fetchRoute = jest.mocked(get3RouteEvmSwap);
let selectedId = account.id;
let onAppState: ((state: AppStateStatus) => void) | undefined;

const propsFor = (quote: EvmSwapQuote): EvmSwapConfirmationModalParams => ({
  type: ConfirmationTypeEnum.EvmSwap,
  accountId: account.id,
  chainId: ETHERLINK_MAINNET_CHAIN_ID,
  quote: { ...quote, receivedAt: Date.now() },
  input: quote.identity.src === SWAP_QUOTE.identity.src ? SWAP_NATIVE_ASSET : SWAP_ERC20_ASSET,
  output: quote.identity.src === SWAP_QUOTE.identity.src ? SWAP_ERC20_ASSET : SWAP_NATIVE_ASSET
});
const flush = async (): Promise<void> => {
  await act(async () => undefined);
};

describe('Etherlink approval and swap coordinator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    selectedId = account.id;
    AppState.currentState = 'active';
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, callback) => {
      onAppState = callback;

      return { remove: jest.fn() };
    });
    jest.mocked(useAllAccounts).mockReturnValue([account]);
    jest.mocked(useCurrentAccountId).mockImplementation(() => selectedId);
    jest.mocked(store.getState).mockImplementation(
      () =>
        ({
          settings: { slippage: 0.25 },
          wallet: { selectedAccountId: selectedId, accounts: [account] }
        } as ReturnType<typeof store.getState>)
    );
    jest.mocked(useEvmChain).mockReturnValue({
      chainId: ETHERLINK_MAINNET_CHAIN_ID,
      activeRpc: { rpcBaseURL: 'https://rpc.example' }
    } as ReturnType<typeof useEvmChain>);
    jest.mocked(useViemPublicClient).mockReturnValue(rpc as unknown as ReturnType<typeof useViemPublicClient>);
    jest.mocked(useEvmTransactionFee).mockReturnValue({
      getSubmissionFees: jest.fn().mockResolvedValue({ gasLimit: 100000n, fees: { type: 'legacy', gasPrice: 10n } }),
      selectedFees: { type: 'legacy', gasPrice: 10n },
      gasLimit: 100000n,
      isEstimating: false,
      retry: jest.fn()
    } as unknown as ReturnType<typeof useEvmTransactionFee>);
    rpc.getBalance.mockResolvedValue(100000000000000000000n);
    rpc.readContract.mockResolvedValue(100000000000000000000n);
    jest.mocked(refreshSwapBalances).mockResolvedValue();
    submit.mockImplementation(async options => {
      options.onBroadcast?.(receipt.transactionHash);

      return { success: true, receipt };
    });
    status.mockResolvedValue({ success: true, receipt });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('skips native approval and retains the exact router request', async () => {
    const { result } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_QUOTE)));
    await flush();
    expect(result.current.phase).toBe('swap');
    await act(async () => {
      await result.current.confirm();
    });
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceAddress: SWAP_OWNER,
        receiptOptions: { confirmations: 2 },
        transaction: expect.objectContaining({ to: SWAP_ROUTER, value: 1000000000000000000n, data: '0x12345678' })
      })
    );
    expect(result.current.confirmedHash).toBe(receipt.transactionHash);
    expect(refreshSwapBalances).toHaveBeenCalled();
  });

  it('blocks execution when allowance RPC fails and offers a retry', async () => {
    rpc.readContract.mockRejectedValueOnce(new Error('RPC unavailable'));
    const { result } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_ERC20_QUOTE)));
    await flush();
    expect(result.current.phase).toBe('allowance');
    expect(result.current.error).toBe('RPC unavailable');
    await act(async () => {
      await result.current.confirm();
    });
    expect(result.current.phase).toBe('swap');
    expect(submit).not.toHaveBeenCalled();
  });

  it('waits for approval receipt, reads allowance, then requires fresh route review', async () => {
    rpc.readContract.mockResolvedValueOnce(0n).mockResolvedValueOnce(0n).mockResolvedValue(100000000000000000000n);
    fetchRoute.mockResolvedValue({ ...SWAP_ERC20_QUOTE.route, toAmountMin: '980000000000000000' });
    let resolveReceipt!: (value: { success: true; receipt: TransactionReceipt }) => void;
    submit.mockImplementationOnce(async options => {
      options.onBroadcast?.(receipt.transactionHash);

      return new Promise(resolve => {
        resolveReceipt = resolve;
      });
    });
    const { result } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_ERC20_QUOTE)));
    await flush();
    expect(result.current.phase).toBe('approval');
    let operation: Promise<void>;
    await act(async () => {
      operation = result.current.confirm();
    });
    expect(submit).toHaveBeenCalledTimes(1);
    expect(fetchRoute).not.toHaveBeenCalled();
    expect(result.current.pending?.action).toBe('approval');
    await act(async () => {
      await result.current.confirm();
    });
    expect(submit).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolveReceipt({ success: true, receipt });
      await operation;
    });
    expect(fetchRoute).toHaveBeenCalledTimes(1);
    expect(result.current.quote.route.toAmountMin).toBe('980000000000000000');
    expect(result.current.phase).toBe('swap');
    expect(submit).toHaveBeenCalledTimes(1);
    expect(result.current.confirmedHash).toBeUndefined();
  });

  it('retries only receipt status after a broadcast timeout', async () => {
    submit.mockImplementationOnce(async options => {
      options.onBroadcast?.(receipt.transactionHash);

      return { success: false, error: new EvmTransactionSubmissionError('receipt-unavailable', 'Timeout') };
    });
    const { result } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_QUOTE)));
    await flush();
    await act(async () => {
      await result.current.confirm();
    });
    expect(result.current.pending?.hash).toBe(receipt.transactionHash);
    await act(async () => {
      await result.current.confirm();
    });
    expect(status).toHaveBeenCalledWith(expect.anything(), receipt.transactionHash, { confirmations: 2 });
    expect(submit).toHaveBeenCalledTimes(1);
    expect(result.current.confirmedHash).toBe(receipt.transactionHash);
  });

  it.each(['transaction-reverted', 'transaction-replaced'] as const)('blocks resubmission after %s', async code => {
    submit.mockImplementationOnce(async options => {
      options.onBroadcast?.(receipt.transactionHash);

      return { success: false, error: new EvmTransactionSubmissionError(code, code) };
    });
    const { result } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_QUOTE)));
    await flush();
    await act(async () => {
      await result.current.confirm();
    });
    expect(result.current.phase).toBe('failed');
    await act(async () => {
      await result.current.confirm();
    });
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('preserves the broadcast guard before React commits receipt state', async () => {
    submit.mockImplementationOnce(async options => {
      options.onBroadcast?.(receipt.transactionHash);

      return { success: false, error: new EvmTransactionSubmissionError('receipt-unavailable', 'Timeout') };
    });
    const { result } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_QUOTE)));
    await flush();
    const confirm = result.current.confirm;
    await act(async () => {
      await confirm();
      await confirm();
    });
    expect(submit).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledTimes(1);
    expect(result.current.confirmedHash).toBe(receipt.transactionHash);
  });

  it('blocks account changes before submission', async () => {
    const { result, rerender } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_QUOTE)));
    await flush();
    selectedId = 'other-account';
    rerender({});
    await act(async () => {
      await result.current.confirm();
    });
    expect(result.current.validAccount).toBe(false);
    expect(submit).not.toHaveBeenCalled();
  });

  it('refreshes after an app pause and requires another confirm', async () => {
    fetchRoute.mockResolvedValue(SWAP_QUOTE.route);
    const { result } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_QUOTE)));
    await flush();
    act(() => {
      onAppState?.('background');
      onAppState?.('active');
    });
    await act(async () => {
      await result.current.confirm();
    });
    expect(fetchRoute).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
    expect(result.current.phase).toBe('swap');
  });

  it('refreshes an expired route and requires another review', async () => {
    const params = propsFor(SWAP_QUOTE);
    fetchRoute.mockResolvedValue(SWAP_QUOTE.route);
    const { result } = renderHook(() => useEvmSwapConfirmation(params));
    await flush();
    jest.spyOn(Date, 'now').mockReturnValue(params.quote.receivedAt + 60000);
    await act(async () => {
      await result.current.confirm();
    });
    expect(fetchRoute).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
    expect(result.current.notice).toContain('Review the output and minimum');
  });

  it('checks the new spender after approval and blocks the swap until its approval', async () => {
    let approved = false;
    rpc.readContract.mockImplementation(async ({ functionName, args }) =>
      functionName === 'balanceOf' || (approved && args[1] === SWAP_ROUTER) ? 100000000000000000000n : 0n
    );
    fetchRoute.mockResolvedValue({ ...SWAP_ERC20_QUOTE.route, txDestination: SWAP_OWNER });
    submit.mockImplementationOnce(async options => {
      options.onBroadcast?.(receipt.transactionHash);
      approved = true;

      return { success: true, receipt };
    });
    const { result } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_ERC20_QUOTE)));
    await flush();
    await act(async () => {
      await result.current.confirm();
    });
    expect(result.current.quote.route.txDestination).toBe(SWAP_OWNER);
    expect(result.current.phase).toBe('approval');
    expect(rpc.readContract).toHaveBeenLastCalledWith(
      expect.objectContaining({ functionName: 'allowance', args: [SWAP_OWNER, SWAP_OWNER] })
    );
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('prevents a double confirm before broadcast', async () => {
    const { result } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_QUOTE)));
    await flush();
    await act(async () => {
      await Promise.all([result.current.confirm(), result.current.confirm()]);
    });
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('reports a confirmed swap separately from a balance refresh failure', async () => {
    jest.mocked(refreshSwapBalances).mockRejectedValueOnce(new Error('RPC unavailable'));
    const { result } = renderHook(() => useEvmSwapConfirmation(propsFor(SWAP_QUOTE)));
    await flush();
    await act(async () => {
      await result.current.confirm();
    });
    expect(result.current.confirmedHash).toBe(receipt.transactionHash);
    expect(result.current.error).toContain('balance refresh failed');
    await act(async () => {
      await result.current.confirm();
    });
    expect(submit).toHaveBeenCalledTimes(1);
    expect(refreshSwapBalances).toHaveBeenCalledTimes(2);
  });
});

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { erc20Abi, Hash } from 'viem';

import { EvmSwapApiError, get3RouteEvmSwap } from 'src/apis/temple-wallet/evm-swap';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useEvmTransactionFee } from 'src/hooks/evm/use-evm-transaction-fee';
import { useViemPublicClient } from 'src/hooks/evm/use-viem-public-client.hook';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { dispatch, store } from 'src/store';
import { navigateAction } from 'src/store/root-state.actions';
import { useAllAccounts, useCurrentAccountId } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmSwapQuote } from 'src/types/evm-swap';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { buildPreparedEvmTransaction } from 'src/utils/evm/build-prepared-evm-transaction';
import { normalizeEvmTransactionError } from 'src/utils/evm/evm-transaction-error';
import { evmTransactionSubmissionService } from 'src/utils/evm/evm-transaction-submission';
import { EvmTransactionSubmissionError } from 'src/utils/evm/evm-transaction-submission-error';
import { refreshSwapBalances } from 'src/utils/evm/refresh-swap-balances';
import {
  assertSwapBalances,
  buildEvmSwapApproval,
  buildEvmSwapRequest,
  isSwapQuoteFresh,
  toSwapRouteRequest,
  validateSwapAssets
} from 'src/utils/evm/swap.utils';
import { showEvmTransactionSuccessToast } from 'src/utils/evm/transaction-toast.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { EvmSwapConfirmationModalParams } from '../confirmation-modal.params';

type Phase = 'allowance' | 'approval' | 'swap' | 'refresh' | 'confirmed' | 'failed';
interface PendingAction {
  hash: Hash;
  action: 'approval' | 'swap';
}

export const useEvmSwapConfirmation = (params: EvmSwapConfirmationModalParams) => {
  const { accountId, chainId, input, output } = params;
  const accounts = useAllAccounts();
  const selectedId = useCurrentAccountId();
  const account = accounts.find(item => item.id === accountId);
  const sourceAddress = account ? getAccountAddressForEvm(account) : undefined;
  const chain = useEvmChain(chainId);
  const client = useViemPublicClient(chainId);
  const [quote, setQuote] = useState(params.quote);
  const [phase, setPhase] = useState<Phase>('allowance');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState<PendingAction>();
  const [needsReview, setNeedsReview] = useState(false);
  const [allowanceRevision, setAllowanceRevision] = useState(0);
  const guard = useRef(false);
  const pendingRef = useRef<PendingAction | undefined>(undefined);
  const confirmedHashRef = useRef<Hash | undefined>(undefined);
  const failedRef = useRef(false);
  const mustRefreshRef = useRef(false);
  const acceptedQuoteRef = useRef(quote);
  const swapSubmittedRef = useRef(false);
  const canClose = useCallback(() => !guard.current || swapSubmittedRef.current, []);
  const mounted = useRef(true);
  const paused = useRef(false);
  const retryAt = useRef(0);
  const requestController = useRef<AbortController | undefined>(undefined);
  const validAccount =
    selectedId === accountId && sourceAddress?.toLowerCase() === quote.identity.fromAddress.toLowerCase();

  const assertAccount = (): void => {
    const state = store.getState();
    const wallet = state.wallet;
    if (String(state.settings.slippage) !== quote.identity.slippage)
      throw new Error('The slippage changed. Return to the swap form.');
    const current = wallet.accounts.find(item => item.id === accountId);
    if (
      wallet.selectedAccountId !== accountId ||
      !current ||
      getAccountAddressForEvm(current)?.toLowerCase() !== quote.identity.fromAddress.toLowerCase()
    ) {
      throw new Error('The selected account changed. Return to the swap form.');
    }
    if (AppState.currentState !== 'active') throw new Error('Return to the app before you confirm.');
    if (chainId !== ETHERLINK_MAINNET_CHAIN_ID || chainId !== quote.identity.chainId)
      throw new Error('Invalid Etherlink network.');
    if (!chain || chain.disabled || chain.disabledAutomatically) throw new Error('Etherlink is unavailable.');
  };

  useEffect(() => {
    mounted.current = true;
    const listener = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        paused.current = true;
        setNeedsReview(true);
        requestController.current?.abort();
      }
    });

    return () => {
      mounted.current = false;
      requestController.current?.abort();
      listener.remove();
    };
  }, []);

  const readAllowance = async (accepted: EvmSwapQuote): Promise<boolean> => {
    if (input.standard === EvmAssetStandardEnum.NATIVE) return true;
    if (!client || !sourceAddress) throw new Error('Etherlink account or RPC is unavailable.');
    const allowance = await client.readContract({
      abi: erc20Abi,
      address: input.contractAddress,
      functionName: 'allowance',
      args: [sourceAddress, accepted.route.txDestination]
    });

    return allowance >= BigInt(accepted.route.fromAmount);
  };

  useEffect(() => {
    let cancelled = false;
    if (phase !== 'allowance' || !validAccount) return;
    setError(undefined);
    const check = async () => {
      try {
        validateSwapAssets(quote, input, output);
        const sufficient = await readAllowance(quote);
        if (!cancelled) setPhase(sufficient ? 'swap' : 'approval');
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Cannot read the token allowance.');
      }
    };
    void check();

    return () => {
      cancelled = true;
    };
    // The quote and client define the allowance owner and spender.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, quote, client, validAccount, allowanceRevision]);

  const request = useMemo(() => {
    if (phase !== 'approval' && phase !== 'swap') return;
    try {
      validateSwapAssets(quote, input, output);

      return phase === 'approval' ? buildEvmSwapApproval(quote, input) : buildEvmSwapRequest(quote, input, output);
    } catch {
      return;
    }
  }, [phase, quote, input, output]);
  const feeState = useEvmTransactionFee({ chainId, sourceAddress, request });

  const refreshQuote = async (): Promise<void> => {
    assertAccount();
    if (Date.now() < retryAt.current) throw new Error('3Route limits requests. Wait before you retry.');
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    const route = await get3RouteEvmSwap(toSwapRouteRequest(quote.identity), controller.signal);
    const next = { identity: quote.identity, route, receivedAt: Date.now() };
    validateSwapAssets(next, input, output);
    assertAccount();
    if (controller.signal.aborted || !mounted.current) return;
    acceptedQuoteRef.current = next;
    mustRefreshRef.current = false;
    setQuote(next);
    setPhase('allowance');
    paused.current = false;
    setNeedsReview(false);
  };

  const refreshBalances = async (): Promise<void> => {
    if (!chain || !sourceAddress) throw new Error('Cannot refresh the account balances.');
    await refreshSwapBalances(toEvmNetworkEssentials(chain), accountId, sourceAddress, input, output);
  };

  const completeReceipt = async (
    action: PendingAction,
    result: Awaited<ReturnType<typeof evmTransactionSubmissionService.waitForConfirmation>>
  ): Promise<void> => {
    if (!result.success) {
      if (!(result.error instanceof EvmTransactionSubmissionError) || result.error.code !== 'receipt-unavailable') {
        pendingRef.current = undefined;
        failedRef.current = true;
        if (mounted.current) {
          setPending(undefined);
          setPhase('failed');
        }
      }
      throw result.error;
    }
    pendingRef.current = undefined;
    if (mounted.current) setPending(undefined);
    if (chain) showEvmTransactionSuccessToast(chain, result.receipt.transactionHash, 'confirmed');
    if (action.action === 'approval') {
      mustRefreshRef.current = true;
      // Receipt success alone does not prove that the token grants the allowance.
      setPhase('refresh');
      if (!(await readAllowance(quote)))
        throw new Error('The approval receipt is confirmed, but the allowance is insufficient. Retry the route.');
      await refreshQuote();
    } else {
      confirmedHashRef.current = result.receipt.transactionHash;
      if (mounted.current) setPhase('confirmed');
      try {
        await refreshBalances();
      } catch {
        showErrorToast({ description: 'The swap is confirmed. Cannot refresh the balances.' });
      }
    }
  };

  const confirm = async (): Promise<void> => {
    if (guard.current) return;
    guard.current = true;
    setBusy(true);
    setError(undefined);
    try {
      if (confirmedHashRef.current) return;
      if (!chain || !sourceAddress || !client) throw new Error('Etherlink account or RPC is unavailable.');
      const network = toEvmNetworkEssentials(chain);
      const pendingAction = pendingRef.current;
      if (pendingAction) {
        const result = await evmTransactionSubmissionService.waitForConfirmation(network, pendingAction.hash, {
          confirmations: 2
        });
        await completeReceipt(pendingAction, result);

        return;
      }
      assertAccount();
      if (failedRef.current) return;
      if (quote !== acceptedQuoteRef.current) throw new Error('Review the fresh route before you confirm.');
      if (mustRefreshRef.current || phase === 'refresh' || needsReview || paused.current || !isSwapQuoteFresh(quote)) {
        await refreshQuote();

        return;
      }
      if (phase === 'allowance') {
        setAllowanceRevision(value => value + 1);

        return;
      }
      if (feeState.estimationError) {
        feeState.retry();

        return;
      }
      if (!request || (phase !== 'approval' && phase !== 'swap')) throw new Error('The swap request is unavailable.');
      validateSwapAssets(quote, input, output);
      const sufficient = await readAllowance(quote);
      if (phase === 'swap' && !sufficient) {
        setPhase('approval');

        return;
      }
      if (phase === 'approval' && sufficient) {
        await refreshQuote();

        return;
      }
      const fees = await feeState.getSubmissionFees();
      if (!fees) throw new Error('Cannot resolve transaction fees.');
      const [nativeBalance, tokenBalance] = await Promise.all([
        client.getBalance({ address: sourceAddress }),
        input.standard === EvmAssetStandardEnum.ERC20
          ? client.readContract({
              abi: erc20Abi,
              address: input.contractAddress,
              functionName: 'balanceOf',
              args: [sourceAddress]
            })
          : Promise.resolve(undefined)
      ]);
      assertAccount();
      if (paused.current || !isSwapQuoteFresh(quote)) {
        await refreshQuote();

        return;
      }
      const feeCap = fees.fees.type === 'legacy' ? fees.fees.gasPrice : fees.fees.maxFeePerGas;
      assertSwapBalances(request, fees.gasLimit, feeCap, nativeBalance, BigInt(quote.route.fromAmount), tokenBalance);
      const action = phase;
      let broadcast: PendingAction | undefined;
      const result = await evmTransactionSubmissionService.submit({
        network,
        sourceAddress,
        transaction: buildPreparedEvmTransaction(request, fees),
        receiptOptions: { confirmations: 2 },
        onBroadcast: hash => {
          broadcast = { hash, action };
          pendingRef.current = broadcast;
          if (mounted.current) setPending(broadcast);
          showEvmTransactionSuccessToast(chain, hash, 'submitted');
          if (action === 'swap') {
            swapSubmittedRef.current = true;
            dispatch(navigateAction({ screen: StacksEnum.MainStack }));
          }
        }
      });
      if (broadcast) await completeReceipt(broadcast, result);
      else if (!result.success) throw result.error;
    } catch (cause) {
      if (cause instanceof EvmSwapApiError && cause.code === 'rate-limit')
        retryAt.current = cause.retryAt ?? Date.now() + 60_000;
      if (swapSubmittedRef.current) {
        const { message } = normalizeEvmTransactionError(cause);
        showErrorToast({ title: `Failed to confirm ${chain?.name ?? 'Etherlink'} transaction`, description: message });
      } else if (mounted.current)
        setError(cause instanceof Error ? cause.message : 'Cannot complete the Etherlink swap action.');
    } finally {
      guard.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const refreshRequired = phase === 'refresh' || needsReview;
  const title = pending
    ? 'Retry transaction status'
    : refreshRequired
    ? 'Refresh route for review'
    : phase === 'allowance'
    ? 'Retry allowance'
    : feeState.estimationError
    ? 'Retry fee estimate'
    : 'Confirm';
  const disabled =
    busy ||
    phase === 'confirmed' ||
    (!pending &&
      (!validAccount ||
        phase === 'failed' ||
        (!refreshRequired &&
          phase !== 'allowance' &&
          !feeState.estimationError &&
          (feeState.isEstimating || !feeState.selectedFees || !request || feeState.hasInsufficientNativeBalance))));

  return {
    account,
    quote,
    phase,
    feeState,
    pending,
    busy,
    error,
    confirm,
    canClose,
    title,
    disabled,
    validAccount
  };
};

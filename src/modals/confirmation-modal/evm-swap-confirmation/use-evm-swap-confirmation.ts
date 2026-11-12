import { StackActions } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { erc20Abi } from 'viem';

import { DeadEndBoundaryError } from 'src/components/error-boundary';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useEvmTransactionFee } from 'src/hooks/evm/use-evm-transaction-fee';
import { useViemPublicClient } from 'src/hooks/evm/use-viem-public-client.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { dispatch } from 'src/store';
import { navigateAction } from 'src/store/root-state.actions';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmSwapQuote } from 'src/types/evm-swap';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { buildPreparedEvmTransaction } from 'src/utils/evm/build-prepared-evm-transaction';
import { evmSwapQuoteService } from 'src/utils/evm/evm-swap-quote-service';
import { normalizeEvmTransactionError } from 'src/utils/evm/evm-transaction-error';
import { evmTransactionSubmissionService } from 'src/utils/evm/evm-transaction-submission';
import { EvmTransactionSubmissionError } from 'src/utils/evm/evm-transaction-submission-error';
import { refreshSwapBalances } from 'src/utils/evm/refresh-swap-balances';
import {
  assertSwapBalances,
  buildEvmSwapApproval,
  buildEvmSwapRequest,
  isSwapQuoteFresh,
  validateSwapAssets
} from 'src/utils/evm/swap.utils';
import { showEvmTransactionSuccessToast } from 'src/utils/evm/transaction-toast.utils';

import { EvmSwapConfirmationModalParams } from '../confirmation-modal.params';

import {
  createEvmSwapConfirmationState,
  EvmSwapConfirmationEvent,
  evmSwapConfirmationReducer,
  isSwapSubmitted,
  PendingSwapAction
} from './evm-swap-confirmation-state';

export const useEvmSwapConfirmation = (params: EvmSwapConfirmationModalParams) => {
  const { accountId, chainId, input, output } = params;
  const { dispatch: dispatchNavigation } = useNavigation();

  const chain = useEvmChain(chainId);
  const sourceAddress = useAccountAddressForEvm();
  const client = useViemPublicClient(chainId);

  if (!chain || !client || !sourceAddress) throw new DeadEndBoundaryError();

  const [state, dispatchState] = useReducer(evmSwapConfirmationReducer, params.quote, createEvmSwapConfirmationState);
  const { quote, busy, error, allowanceRevision, step } = state;

  const phase = step.type === 'pending' ? step.transaction.action : step.type;
  const pending = step.type === 'pending' ? step.transaction : undefined;

  const guard = useRef(false);
  const mounted = useRef(true);
  const stateRef = useRef(state);
  const requestController = useRef<AbortController | undefined>(undefined);

  const transition = useCallback((event: EvmSwapConfirmationEvent): void => {
    // Receipt handlers continue after the modal closes, so they need the latest transition immediately.
    stateRef.current = evmSwapConfirmationReducer(stateRef.current, event);
    if (mounted.current) dispatchState(event);
  }, []);

  const canClose = useCallback(() => !guard.current || isSwapSubmitted(stateRef.current), []);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      requestController.current?.abort();
    };
  }, []);

  const openNextConfirmation = (nextQuote: EvmSwapQuote = quote): void => {
    guard.current = false;
    dispatchNavigation(StackActions.replace(ModalsEnum.Confirmation, { ...params, quote: nextQuote }));
  };

  const readAllowance = async (accepted: EvmSwapQuote): Promise<boolean> => {
    if (input.standard === EvmAssetStandardEnum.NATIVE) return true;
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
    if (phase !== 'allowance') return;
    transition({ type: 'error' });
    const check = async () => {
      try {
        validateSwapAssets(quote, input, output);
        const sufficient = await readAllowance(quote);
        if (!cancelled) transition({ type: 'allowance-resolved', sufficient });
      } catch (cause) {
        if (!cancelled)
          transition({
            type: 'error',
            message: cause instanceof Error ? cause.message : 'Cannot read the token allowance.'
          });
      }
    };
    void check();

    return () => {
      cancelled = true;
    };
    // The quote and client define the allowance owner and spender.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, quote, client, allowanceRevision]);

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

  const loadQuote = async (): Promise<EvmSwapQuote | undefined> => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    const next = await evmSwapQuoteService.load(quote.identity, controller.signal);
    validateSwapAssets(next, input, output);
    if (controller.signal.aborted || !mounted.current) return;

    return next;
  };

  const refreshQuote = async (): Promise<void> => {
    const next = await loadQuote();
    if (next) transition({ type: 'quote-refreshed', quote: next });
  };

  const refreshBalances = async (): Promise<void> => {
    await refreshSwapBalances(toEvmNetworkEssentials(chain), accountId, sourceAddress, input, output);
  };

  const completeReceipt = async (
    action: PendingSwapAction,
    result: Awaited<ReturnType<typeof evmTransactionSubmissionService.waitForConfirmation>>
  ): Promise<void> => {
    if (!result.success) {
      if (!(result.error instanceof EvmTransactionSubmissionError) || result.error.code !== 'receipt-unavailable') {
        transition({ type: 'transaction-failed', transaction: action });
      }
      throw result.error;
    }
    if (chain) showEvmTransactionSuccessToast(chain, result.receipt.transactionHash, 'confirmed');
    let nextQuote = quote;
    if (action.action === 'approval') {
      if (!mounted.current) return;
      const freshQuote = isSwapQuoteFresh(quote) ? quote : await loadQuote();
      if (!freshQuote) return;
      nextQuote = freshQuote;
    }
    transition({
      type: 'transaction-confirmed',
      transaction: { ...action, hash: result.receipt.transactionHash }
    });
    if (action.action === 'approval') {
      openNextConfirmation(nextQuote);
    } else {
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
    transition({ type: 'start' });
    try {
      if (stateRef.current.step.type === 'confirmed') return;
      const network = toEvmNetworkEssentials(chain);
      const currentStep = stateRef.current.step;
      const pendingAction = currentStep.type === 'pending' ? currentStep.transaction : undefined;
      if (pendingAction) {
        const result = await evmTransactionSubmissionService.waitForConfirmation(network, pendingAction.hash, {
          confirmations: pendingAction.action === 'approval' ? 1 : 2
        });
        await completeReceipt(pendingAction, result);

        return;
      }
      if (currentStep.type === 'failed') return;
      if (quote !== stateRef.current.quote) throw new Error('Review the fresh route before you confirm.');
      if (!isSwapQuoteFresh(quote)) {
        await refreshQuote();

        return;
      }
      if (phase === 'allowance') {
        transition({ type: 'retry-allowance' });

        return;
      }
      if (feeState.estimationError) {
        feeState.retry();

        return;
      }
      if (!request || (phase !== 'approval' && phase !== 'swap')) throw new Error('The swap request is unavailable.');
      validateSwapAssets(quote, input, output);
      const sufficient = await readAllowance(quote);
      if ((phase === 'swap' && !sufficient) || (phase === 'approval' && sufficient)) {
        openNextConfirmation();

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
      if (!isSwapQuoteFresh(quote)) {
        await refreshQuote();

        return;
      }
      const feeCap = fees.fees.type === 'legacy' ? fees.fees.gasPrice : fees.fees.maxFeePerGas;
      assertSwapBalances(request, fees.gasLimit, feeCap, nativeBalance, BigInt(quote.route.fromAmount), tokenBalance);
      const action = phase;
      let broadcast: PendingSwapAction | undefined;
      const result = await evmTransactionSubmissionService.submit({
        network,
        sourceAddress,
        transaction: buildPreparedEvmTransaction(request, fees),
        receiptOptions: { confirmations: action === 'approval' ? 1 : 2 },
        onBroadcast: hash => {
          broadcast = { hash, action };
          transition({ type: 'broadcast', transaction: broadcast });
          showEvmTransactionSuccessToast(chain, hash, 'submitted');
          if (action === 'swap') {
            dispatch(navigateAction({ screen: StacksEnum.MainStack }));
          }
        }
      });
      if (broadcast) await completeReceipt(broadcast, result);
      else if (!result.success) throw result.error;
    } catch (cause) {
      if (isSwapSubmitted(stateRef.current)) {
        const { message } = normalizeEvmTransactionError(cause);
        showErrorToast({ title: `Failed to confirm ${chain?.name} transaction`, description: message });
      } else if (mounted.current)
        transition({
          type: 'error',
          message: cause instanceof Error ? cause.message : 'Cannot complete swap action.'
        });
    } finally {
      guard.current = false;
      transition({ type: 'finish' });
    }
  };

  const title = feeState.estimationError ? 'Retry' : 'Confirm';
  const disabled =
    busy ||
    phase === 'confirmed' ||
    (!pending &&
      (phase === 'failed' ||
        (isSwapQuoteFresh(quote) &&
          phase !== 'allowance' &&
          !feeState.estimationError &&
          (feeState.isEstimating || !feeState.selectedFees || !request || feeState.hasInsufficientNativeBalance))));

  return {
    quote,
    phase,
    feeState,
    pending,
    busy,
    error,
    confirm,
    canClose,
    title,
    disabled
  };
};

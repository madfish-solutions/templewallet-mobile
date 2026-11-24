import { Hash } from 'viem';

import { EvmSwapQuote } from 'src/types/evm-swap';

export interface PendingSwapAction {
  hash: Hash;
  action: 'approval' | 'swap';
}

type ConfirmationStep =
  | { type: 'allowance' | 'approval' | 'swap' }
  | { type: 'pending'; transaction: PendingSwapAction }
  | { type: 'confirmed'; transaction: PendingSwapAction }
  | { type: 'failed'; transaction: PendingSwapAction };

interface EvmSwapConfirmationState {
  quote: EvmSwapQuote;
  step: ConfirmationStep;
  busy: boolean;
  error?: string;
  allowanceRevision: number;
}

export type EvmSwapConfirmationEvent =
  | { type: 'start' | 'finish' | 'retry-allowance' }
  | { type: 'error'; message?: string }
  | { type: 'quote-refreshed'; quote: EvmSwapQuote }
  | { type: 'allowance-resolved'; sufficient: boolean }
  | { type: 'broadcast'; transaction: PendingSwapAction }
  | { type: 'transaction-confirmed'; transaction: PendingSwapAction }
  | { type: 'transaction-failed'; transaction: PendingSwapAction };

export const createEvmSwapConfirmationState = (quote: EvmSwapQuote): EvmSwapConfirmationState => ({
  quote,
  step: { type: 'allowance' },
  busy: false,
  allowanceRevision: 0
});

export const evmSwapConfirmationReducer = (
  state: EvmSwapConfirmationState,
  event: EvmSwapConfirmationEvent
): EvmSwapConfirmationState => {
  switch (event.type) {
    case 'start':
      return { ...state, busy: true, error: undefined };
    case 'finish':
      if (!state.busy) return state;

      return { ...state, busy: false };
    case 'error':
      if (state.error === event.message) return state;

      return { ...state, error: event.message };
    case 'retry-allowance':
      return { ...state, allowanceRevision: state.allowanceRevision + 1 };
    case 'quote-refreshed':
      if (state.step.type === 'pending' || state.step.type === 'confirmed' || state.step.type === 'failed')
        return state;

      return { ...state, quote: event.quote, step: { type: 'allowance' } };
    case 'allowance-resolved':
      if (state.step.type !== 'allowance' && state.step.type !== 'approval' && state.step.type !== 'swap') return state;

      return { ...state, step: { type: event.sufficient ? 'swap' : 'approval' } };
    case 'broadcast':
      if (state.step.type !== event.transaction.action) return state;

      return { ...state, step: { type: 'pending', transaction: event.transaction } };
    case 'transaction-confirmed':
      if (state.step.type !== 'pending' || state.step.transaction.action !== event.transaction.action) return state;

      return { ...state, step: { type: 'confirmed', transaction: event.transaction } };
    case 'transaction-failed':
      if (state.step.type !== 'pending' || state.step.transaction.hash !== event.transaction.hash) return state;

      return { ...state, step: { type: 'failed', transaction: event.transaction } };
  }
};

export const isSwapSubmitted = ({ step }: EvmSwapConfirmationState): boolean =>
  (step.type === 'pending' || step.type === 'confirmed' || step.type === 'failed') &&
  step.transaction.action === 'swap';

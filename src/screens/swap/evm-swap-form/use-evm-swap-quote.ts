import { useCallback, useEffect, useRef, useState } from 'react';

import { EvmSwapApiError } from 'src/apis/temple-wallet/evm-swap';
import { EvmSwapQuote, EvmSwapQuoteIdentity } from 'src/types/evm-swap';
import { evmSwapQuoteService } from 'src/utils/evm/evm-swap-quote-service';
import { EVM_SWAP_QUOTE_LIFETIME, swapIdentityKey } from 'src/utils/evm/swap.utils';

interface QuoteState {
  quote?: EvmSwapQuote;
  error?: Error;
  isLoading: boolean;
}

export const useEvmSwapQuote = (identity: EvmSwapQuoteIdentity | undefined, active: boolean) => {
  const [state, setState] = useState<QuoteState>({ isLoading: false });
  const [revision, setRevision] = useState(0);
  const requestId = useRef(0);
  const activeRequest = useRef(false);
  const key = swapIdentityKey(identity);
  const currentKey = useRef(key);
  currentKey.current = active ? key : '';

  const invalidate = useCallback(() => {
    ++requestId.current;
    activeRequest.current = false;
    setState({ isLoading: false });
    setRevision(value => value + 1);
  }, []);

  useEffect(() => {
    const id = ++requestId.current;
    const controller = new AbortController();
    activeRequest.current = false;
    setState({ isLoading: Boolean(identity && active) });
    if (!identity || !active) return;

    const timeout = setTimeout(async () => {
      activeRequest.current = true;
      try {
        const quote = await evmSwapQuoteService.load(identity, controller.signal);
        if (id === requestId.current && key === currentKey.current) {
          setState({ isLoading: false, quote });
        }
      } catch (error) {
        if (id !== requestId.current || key !== currentKey.current) return;
        if (error instanceof EvmSwapApiError && error.code === 'cancelled') return;
        setState({
          isLoading: false,
          error: error instanceof Error ? error : new Error('Cannot obtain a 3Route quote.')
        });
      } finally {
        if (id === requestId.current) activeRequest.current = false;
      }
    }, 200);

    return () => {
      ++requestId.current;
      activeRequest.current = false;
      clearTimeout(timeout);
      controller.abort();
    };
    // The serialized identity includes every request field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, active, revision]);

  useEffect(() => {
    if (!active || !key) return;
    if (state.error) {
      const delay =
        state.error instanceof EvmSwapApiError && state.error.code === 'rate-limit'
          ? Math.max(0, (state.error.retryAt ?? Date.now() + EVM_SWAP_QUOTE_LIFETIME) - Date.now())
          : EVM_SWAP_QUOTE_LIFETIME;
      const timeout = setTimeout(invalidate, delay);

      return () => clearTimeout(timeout);
    }
    const interval = setInterval(() => {
      if (!activeRequest.current) invalidate();
    }, EVM_SWAP_QUOTE_LIFETIME);

    return () => clearInterval(interval);
  }, [key, active, invalidate, state.error]);

  const quote = active && state.quote && swapIdentityKey(state.quote.identity) === key ? state.quote : undefined;

  return { ...state, quote, invalidate };
};

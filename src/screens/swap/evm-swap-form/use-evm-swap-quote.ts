import { useCallback, useEffect, useRef, useState } from 'react';

import { EvmSwapApiError, get3RouteEvmSwap } from 'src/apis/temple-wallet/evm-swap';
import { EvmSwapQuote, EvmSwapQuoteIdentity } from 'src/types/evm-swap';
import {
  EVM_SWAP_QUOTE_LIFETIME,
  swapIdentityKey,
  toSwapRouteRequest,
  validateSwapRouteIdentity
} from 'src/utils/evm/swap.utils';

interface QuoteState {
  quote?: EvmSwapQuote;
  error?: Error;
  isLoading: boolean;
}

export const useEvmSwapQuote = (identity: EvmSwapQuoteIdentity | undefined, active: boolean) => {
  const [state, setState] = useState<QuoteState>({ isLoading: false });
  const [revision, setRevision] = useState(0);
  const requestId = useRef(0);
  const retryAt = useRef(0);
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
      if (Date.now() < retryAt.current) {
        setState({
          isLoading: false,
          error: new EvmSwapApiError('rate-limit', 'Wait before you retry the 3Route request.', retryAt.current)
        });

        return;
      }
      activeRequest.current = true;
      try {
        const route = await get3RouteEvmSwap(toSwapRouteRequest(identity), controller.signal);
        validateSwapRouteIdentity(route, identity);
        if (id === requestId.current && key === currentKey.current) {
          setState({ isLoading: false, quote: { identity, route, receivedAt: Date.now() } });
        }
      } catch (error) {
        if (id !== requestId.current || key !== currentKey.current) return;
        if (error instanceof EvmSwapApiError && error.code === 'cancelled') return;
        if (error instanceof EvmSwapApiError && error.code === 'rate-limit')
          retryAt.current = error.retryAt ?? Date.now() + 60_000;
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
    if (!active || state.error) return;
    const interval = setInterval(() => {
      if (!activeRequest.current) invalidate();
    }, EVM_SWAP_QUOTE_LIFETIME);

    return () => clearInterval(interval);
  }, [active, invalidate, state.error]);

  const quote = active && state.quote && swapIdentityKey(state.quote.identity) === key ? state.quote : undefined;

  return { ...state, quote, invalidate };
};

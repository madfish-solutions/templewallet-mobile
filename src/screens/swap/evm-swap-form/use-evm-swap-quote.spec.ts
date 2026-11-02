import { act, renderHook } from '@testing-library/react-native';

import { EvmSwapApiError, get3RouteEvmSwap, Route3EvmRoute } from 'src/apis/temple-wallet/evm-swap';
import { EvmSwapQuoteIdentity } from 'src/types/evm-swap';
import { SWAP_QUOTE, SWAP_ROUTE, SWAP_ROUTER } from 'src/utils/evm/swap.mock';

import { useEvmSwapQuote } from './use-evm-swap-quote';

jest.mock('src/api.service', () => ({ templeWalletApi: { get: jest.fn() } }));
jest.mock('src/apis/temple-wallet/evm-swap', () => ({
  ...jest.requireActual('src/apis/temple-wallet/evm-swap'),
  get3RouteEvmSwap: jest.fn()
}));
const fetchRoute = jest.mocked(get3RouteEvmSwap);
const deferredRoute = () => {
  let resolve!: (route: Route3EvmRoute) => void;
  const promise = new Promise<Route3EvmRoute>(done => {
    resolve = done;
  });

  return { promise, resolve };
};
const tick = async (ms: number): Promise<void> => {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
};

describe('Etherlink quote lifecycle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    fetchRoute.mockReset();
    fetchRoute.mockResolvedValue(SWAP_ROUTE);
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces for 200 milliseconds and serializes atomic amounts', async () => {
    const { result } = renderHook(() => useEvmSwapQuote(SWAP_QUOTE.identity, true));
    await tick(199);
    expect(fetchRoute).not.toHaveBeenCalled();
    await tick(1);
    expect(fetchRoute).toHaveBeenCalledWith(
      expect.objectContaining({ amount: SWAP_ROUTE.fromAmount, slippage: '0.25', fee: '0.6' }),
      expect.anything()
    );
    expect(result.current.quote?.route).toEqual(SWAP_ROUTE);
  });

  it('rejects request A after request B even when cancellation does not stop A', async () => {
    const a = deferredRoute();
    const b = deferredRoute();
    fetchRoute.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise);
    const { result, rerender } = renderHook((identity: EvmSwapQuoteIdentity) => useEvmSwapQuote(identity, true), {
      initialProps: SWAP_QUOTE.identity
    });
    await tick(200);
    const signalA = fetchRoute.mock.calls[0][1];
    rerender({ ...SWAP_QUOTE.identity, amount: '2' });
    expect(result.current.quote).toBeUndefined();
    expect(signalA?.aborted).toBe(true);
    await tick(200);
    await act(async () => {
      b.resolve({ ...SWAP_ROUTE, fromAmount: '2' });
    });
    await act(async () => {
      a.resolve(SWAP_ROUTE);
    });
    expect(result.current.quote?.identity.amount).toBe('2');
  });

  it.each([
    { fromAddress: SWAP_ROUTER },
    { slippage: '0.5' },
    { src: SWAP_ROUTER },
    { dst: SWAP_ROUTER },
    { chainId: 1 },
    { fee: '1' },
    { referrer: SWAP_ROUTER }
  ])('invalidates immediately for identity changes: %j', async change => {
    const { result, rerender } = renderHook((identity: EvmSwapQuoteIdentity) => useEvmSwapQuote(identity, true), {
      initialProps: SWAP_QUOTE.identity
    });
    await tick(200);
    expect(result.current.quote).toBeDefined();
    rerender({ ...SWAP_QUOTE.identity, ...change });
    expect(result.current.quote).toBeUndefined();
  });

  it('clears invalid pairs, cancels on unmount, and starts without a persisted quote', async () => {
    const pending = deferredRoute();
    fetchRoute.mockReturnValue(pending.promise);
    const { result, rerender, unmount } = renderHook(
      (identity: EvmSwapQuoteIdentity | undefined) => useEvmSwapQuote(identity, true),
      { initialProps: SWAP_QUOTE.identity as EvmSwapQuoteIdentity | undefined }
    );
    expect(result.current.quote).toBeUndefined();
    await tick(200);
    const signal = fetchRoute.mock.calls[0][1];
    rerender(undefined);
    expect(result.current.quote).toBeUndefined();
    expect(signal?.aborted).toBe(true);
    unmount();
    await act(async () => {
      pending.resolve(SWAP_ROUTE);
    });
  });

  it('refreshes every 60 seconds and pauses for focus loss or review', async () => {
    const { result, rerender } = renderHook((active: boolean) => useEvmSwapQuote(SWAP_QUOTE.identity, active), {
      initialProps: true
    });
    await tick(200);
    await tick(59800);
    expect(result.current.quote).toBeUndefined();
    await tick(200);
    expect(fetchRoute).toHaveBeenCalledTimes(2);
    rerender(false);
    await tick(120000);
    expect(fetchRoute).toHaveBeenCalledTimes(2);
    expect(result.current.quote).toBeUndefined();
    rerender(true);
    await tick(200);
    expect(fetchRoute).toHaveBeenCalledTimes(3);
  });

  it('does not refresh during a request or automatically retry a rate limit', async () => {
    const pending = deferredRoute();
    fetchRoute.mockReturnValueOnce(pending.promise);
    const { result } = renderHook(() => useEvmSwapQuote(SWAP_QUOTE.identity, true));
    await tick(60000);
    expect(fetchRoute).toHaveBeenCalledTimes(1);
    fetchRoute.mockRejectedValueOnce(new EvmSwapApiError('rate-limit', 'Wait', Date.now() + 60000));
    await act(async () => {
      pending.resolve(SWAP_ROUTE);
    });
    act(() => {
      result.current.invalidate();
    });
    await tick(200);
    expect(result.current.error).toMatchObject({ code: 'rate-limit' });
    await tick(120000);
    expect(fetchRoute).toHaveBeenCalledTimes(2);
  });

  it('rejects a route for a different source amount', async () => {
    fetchRoute.mockResolvedValue({ ...SWAP_ROUTE, fromAmount: '2' });
    const { result } = renderHook(() => useEvmSwapQuote(SWAP_QUOTE.identity, true));
    await tick(200);
    expect(result.current.quote).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });
});

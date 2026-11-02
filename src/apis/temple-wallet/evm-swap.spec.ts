import { AxiosError, AxiosHeaders, CanceledError } from 'axios';

import { templeWalletApi } from 'src/api.service';
import { SWAP_ERC20_TOKEN, SWAP_NATIVE_TOKEN, SWAP_QUOTE, SWAP_ROUTE } from 'src/utils/evm/swap.mock';
import { toSwapRouteRequest } from 'src/utils/evm/swap.utils';

import {
  get3RouteEvmSwap,
  get3RouteEvmTokens,
  parse3RouteEvmRoute,
  parse3RouteEvmToken,
  parse3RouteEvmTokens
} from './evm-swap';

jest.mock('src/api.service', () => ({ templeWalletApi: { get: jest.fn() } }));
const get = jest.mocked(templeWalletApi.get);

const httpError = (status: number, retryAfter?: string) =>
  new AxiosError('Request failed', undefined, undefined, undefined, {
    data: null,
    status,
    statusText: '',
    headers: new AxiosHeaders(retryAfter ? { 'retry-after': retryAfter } : {}),
    config: { headers: new AxiosHeaders() }
  });

describe('Etherlink 3Route boundary', () => {
  beforeEach(() => jest.clearAllMocks());

  it('validates the address-keyed catalog and normalizes addresses', () => {
    const token = { ...SWAP_ERC20_TOKEN, address: SWAP_ERC20_TOKEN.address.toUpperCase().replace('0X', '0x') };
    expect(parse3RouteEvmTokens({ [token.address]: token })).toEqual({ [SWAP_ERC20_TOKEN.address]: SWAP_ERC20_TOKEN });
    expect(parse3RouteEvmToken(SWAP_NATIVE_TOKEN)).toEqual(SWAP_NATIVE_TOKEN);
    expect(() => parse3RouteEvmTokens({ tokens: {} })).toThrow();
    expect(() => parse3RouteEvmTokens({ [SWAP_NATIVE_TOKEN.address]: SWAP_ERC20_TOKEN })).toThrow();
  });

  it.each([
    { address: '0x123' },
    { decimals: -1 },
    { decimals: 256 },
    { decimals: 1.5 },
    { tags: ['ERC20', 1] },
    { symbol: '' },
    { priceUSD: 'NaN' },
    { priceUSD: '-1' }
  ])('rejects invalid token fields: %j', fields => {
    expect(() => parse3RouteEvmToken({ ...SWAP_ERC20_TOKEN, ...fields })).toThrow();
  });

  it.each([
    { txDestination: '0x123' },
    { txDestination: SWAP_NATIVE_TOKEN.address },
    { txData: '0x' },
    { txData: '0x1234567' },
    { txData: '0x1234567z' },
    { fromAmount: '1e18' },
    { fromAmount: '1.1' },
    { fromAmount: '0' },
    { toAmount: '-1' },
    { gas: '0' },
    { gas: '1.1' },
    { gasPrice: 'NaN' },
    { toAmountMin: undefined },
    { toAmountMin: '0' },
    { toAmountMin: '1000001' },
    { stepsCount: 1.5 },
    { fromAddress: 'tz1invalid' }
  ])('rejects invalid executable fields: %j', fields => {
    expect(() => parse3RouteEvmRoute({ ...SWAP_ROUTE, ...fields })).toThrow();
  });

  it('retains atomic amounts above Number.MAX_SAFE_INTEGER', () => {
    expect(parse3RouteEvmRoute(SWAP_ROUTE)).toEqual(SWAP_ROUTE);
    expect(parse3RouteEvmRoute({ ...SWAP_ROUTE, fromAmount: '900719925474099312345' }).fromAmount).toBe(
      '900719925474099312345'
    );
  });

  it('uses the Temple client with timeout and cancellation', async () => {
    get
      .mockResolvedValueOnce({ data: { [SWAP_NATIVE_TOKEN.address]: SWAP_NATIVE_TOKEN } })
      .mockResolvedValueOnce({ data: SWAP_ROUTE });
    const signal = new AbortController().signal;
    await get3RouteEvmTokens(signal);
    await get3RouteEvmSwap(toSwapRouteRequest(SWAP_QUOTE.identity), signal);
    expect(get).toHaveBeenNthCalledWith(1, '/evm/3route-tokens', { timeout: 15000, signal, params: undefined });
    expect(get).toHaveBeenNthCalledWith(2, '/evm/3route-swap', {
      timeout: 15000,
      signal,
      params: expect.objectContaining({ amount: '1000000000000000000', fee: '0.6', slippage: '0.25' })
    });
  });

  it('distinguishes cancellation, no route, and network failure', async () => {
    get
      .mockRejectedValueOnce(new CanceledError())
      .mockRejectedValueOnce(httpError(404))
      .mockRejectedValueOnce(new Error('offline'));
    await expect(get3RouteEvmTokens()).rejects.toMatchObject({ code: 'cancelled' });
    await expect(get3RouteEvmSwap(toSwapRouteRequest(SWAP_QUOTE.identity))).rejects.toMatchObject({ code: 'no-route' });
    await expect(get3RouteEvmTokens()).rejects.toMatchObject({ code: 'network' });
  });

  it('honors Retry-After without automatic retries', async () => {
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000);
    get.mockRejectedValueOnce(httpError(429, '30'));
    await expect(get3RouteEvmTokens()).rejects.toMatchObject({ code: 'rate-limit', retryAt: 31000 });
    expect(get).toHaveBeenCalledTimes(1);
  });
});

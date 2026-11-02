import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { isAddress, isHex, zeroAddress } from 'viem';

import { templeWalletApi } from 'src/api.service';

export interface Route3EvmTokenWithPrice {
  address: HexString;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  tags: string[] | null;
  priceUSD?: string;
}

export interface Route3EvmRouteRequest {
  src: string;
  dst: string;
  amount: string;
  from: HexString;
  slippage: string;
  referrer?: HexString;
  fee?: string;
}

export interface Route3EvmRoute {
  fromAmount: string;
  fromAmountUSD: string;
  toAmount: string;
  toAmountUSD: string;
  fromAddress: HexString;
  fromToken: Route3EvmTokenWithPrice;
  toToken: Route3EvmTokenWithPrice;
  stepsCount: number;
  txDestination: HexString;
  txData: HexString;
  gas: string;
  gasPrice: string;
  toAmountMin: string;
}

export type EvmSwapApiErrorCode = 'cancelled' | 'invalid-response' | 'no-route' | 'network' | 'rate-limit';

export class EvmSwapApiError extends Error {
  constructor(readonly code: EvmSwapApiErrorCode, message: string, readonly retryAt?: number) {
    super(message);
    this.name = 'EvmSwapApiError';
  }
}

const invalidResponse = (): never => {
  throw new EvmSwapApiError('invalid-response', '3Route returned an invalid response. Retry the request.');
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const record = (value: unknown): Record<string, unknown> => (isRecord(value) ? value : invalidResponse());
const nonemptyString = (value: unknown): string =>
  typeof value === 'string' && value.trim().length > 0 ? value : invalidResponse();
const decimalString = (value: unknown): string =>
  typeof value === 'string' && /^(0|[1-9]\d*)(\.\d+)?$/.test(value) ? value : invalidResponse();
const integerString = (value: unknown): string => {
  const result = decimalString(value);

  return /^\d+$/.test(result) && BigInt(result) > 0n && BigInt(result) < 2n ** 256n ? result : invalidResponse();
};
const address = (value: unknown): HexString => {
  const normalized = typeof value === 'string' ? value.toLowerCase() : '';

  return isAddress(normalized) ? normalized : invalidResponse();
};

export const parse3RouteEvmToken = (value: unknown): Route3EvmTokenWithPrice => {
  const token = record(value);
  const decimals = token.decimals;
  if (typeof decimals !== 'number' || !Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    return invalidResponse();
  }
  const tags = token.tags;
  if (tags !== null && (!Array.isArray(tags) || !tags.every((tag): tag is string => typeof tag === 'string'))) {
    return invalidResponse();
  }

  return {
    address: address(token.address),
    symbol: nonemptyString(token.symbol),
    name: nonemptyString(token.name),
    decimals,
    tags,
    logoURI: token.logoURI === undefined ? undefined : nonemptyString(token.logoURI),
    priceUSD: token.priceUSD === undefined ? undefined : decimalString(token.priceUSD)
  };
};

export const parse3RouteEvmTokens = (value: unknown): Record<string, Route3EvmTokenWithPrice> => {
  const result: Record<string, Route3EvmTokenWithPrice> = {};
  for (const [key, rawToken] of Object.entries(record(value))) {
    const token = parse3RouteEvmToken(rawToken);
    if (address(key) !== token.address) return invalidResponse();
    result[token.address] = token;
  }

  return result;
};

export const parse3RouteEvmRoute = (value: unknown): Route3EvmRoute => {
  const route = record(value);
  const txDestination = address(route.txDestination);
  const txData = route.txData;
  const stepsCount = route.stepsCount;
  if (
    txDestination === zeroAddress ||
    typeof txData !== 'string' ||
    !isHex(txData, { strict: true }) ||
    !/^0x[\da-fA-F]{8}(?:[\da-fA-F]{2})*$/.test(txData) ||
    typeof stepsCount !== 'number' ||
    !Number.isSafeInteger(stepsCount) ||
    stepsCount < 1
  )
    return invalidResponse();
  const toAmount = integerString(route.toAmount);
  const toAmountMin = integerString(route.toAmountMin);
  if (BigInt(toAmountMin) > BigInt(toAmount)) return invalidResponse();

  return {
    fromAmount: integerString(route.fromAmount),
    fromAmountUSD: decimalString(route.fromAmountUSD),
    toAmount,
    toAmountUSD: decimalString(route.toAmountUSD),
    fromAddress: address(route.fromAddress),
    fromToken: parse3RouteEvmToken(route.fromToken),
    toToken: parse3RouteEvmToken(route.toToken),
    stepsCount,
    txDestination,
    txData,
    gas: integerString(route.gas),
    gasPrice: integerString(route.gasPrice),
    toAmountMin
  };
};

const request = async (path: string, signal?: AbortSignal, params?: Route3EvmRouteRequest): Promise<unknown> => {
  try {
    const response = await templeWalletApi.get<unknown>(path, { params, signal, timeout: 15_000 });
    if (response.data == null) throw new EvmSwapApiError('no-route', 'No route is available for this pair and amount.');

    return response.data;
  } catch (error) {
    if (error instanceof EvmSwapApiError) throw error;
    if (axios.isCancel(error)) throw new EvmSwapApiError('cancelled', 'The request was cancelled.');
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404)
        throw new EvmSwapApiError('no-route', 'No route is available for this pair and amount.');
      if (error.response?.status === 429) {
        const header: unknown = error.response.headers['retry-after'];
        const delay = typeof header === 'string' ? new BigNumber(header) : undefined;
        const retryAt =
          delay?.isFinite() && delay.gte(0)
            ? Date.now() + delay.multipliedBy(1000).toNumber()
            : typeof header === 'string'
            ? Date.parse(header)
            : undefined;
        throw new EvmSwapApiError(
          'rate-limit',
          '3Route limits requests. Wait before you retry.',
          retryAt !== undefined && Number.isFinite(retryAt) ? retryAt : Date.now() + 60_000
        );
      }
    }
    throw new EvmSwapApiError('network', 'Cannot reach 3Route. Retry the request.');
  }
};

export const get3RouteEvmTokens = async (signal?: AbortSignal): Promise<Record<string, Route3EvmTokenWithPrice>> =>
  parse3RouteEvmTokens(await request('/evm/3route-tokens', signal));

export const get3RouteEvmSwap = async (params: Route3EvmRouteRequest, signal?: AbortSignal): Promise<Route3EvmRoute> =>
  parse3RouteEvmRoute(await request('/evm/3route-swap', signal, params));

import axios from 'axios';
import { BigNumber } from 'bignumber.js';

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

export type EvmSwapApiErrorCode = 'cancelled' | 'no-route' | 'network' | 'rate-limit';

export class EvmSwapApiError extends Error {
  constructor(readonly code: EvmSwapApiErrorCode, message: string, readonly retryAt?: number) {
    super(message);
    this.name = 'EvmSwapApiError';
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const request = async <T>(path: string, signal?: AbortSignal, params?: Route3EvmRouteRequest): Promise<T> => {
  try {
    const response = await templeWalletApi.get<T>(path, { params, signal, timeout: 15_000 });
    if (response.data == null) throw new EvmSwapApiError('no-route', 'No route available');

    return response.data;
  } catch (error) {
    if (error instanceof EvmSwapApiError) throw error;
    if (axios.isCancel(error)) throw new EvmSwapApiError('cancelled', 'The request was cancelled.');
    if (axios.isAxiosError(error)) {
      const body: unknown = error.response?.data;
      const quoteNotFound =
        error.response?.status === 400 &&
        isRecord(body) &&
        [body.error, body.description, body.message].some(
          value => typeof value === 'string' && value.trim().toLowerCase() === 'quote not found'
        );
      if (error.response?.status === 404 || quoteNotFound) throw new EvmSwapApiError('no-route', 'No route available');
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
  request('/evm/3route-tokens', signal);

export const get3RouteEvmSwap = async (params: Route3EvmRouteRequest, signal?: AbortSignal): Promise<Route3EvmRoute> =>
  request('/evm/3route-swap', signal, params);

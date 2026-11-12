import { EvmSwapApiError, get3RouteEvmSwap } from 'src/apis/temple-wallet/evm-swap';
import { EvmSwapQuote, EvmSwapQuoteIdentity } from 'src/types/evm-swap';

import { toSwapRouteRequest, validateSwapRouteIdentity } from './swap.utils';

class EvmSwapQuoteService {
  private retryAt = 0;

  async load(identity: EvmSwapQuoteIdentity, signal?: AbortSignal): Promise<EvmSwapQuote> {
    if (Date.now() < this.retryAt) {
      throw new EvmSwapApiError('rate-limit', '3Route limits requests. Wait before you retry.', this.retryAt);
    }

    try {
      const route = await get3RouteEvmSwap(toSwapRouteRequest(identity), signal);
      validateSwapRouteIdentity(route, identity);

      return { identity, route, receivedAt: Date.now() };
    } catch (error) {
      if (error instanceof EvmSwapApiError && error.code === 'rate-limit') {
        this.retryAt = error.retryAt ?? Date.now() + 60_000;
        throw new EvmSwapApiError(error.code, error.message, this.retryAt);
      }

      throw error;
    }
  }
}

export const evmSwapQuoteService = new EvmSwapQuoteService();

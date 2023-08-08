import { BigNumber } from 'bignumber.js';

import { THREE_ROUTE_TZBTC_TOKEN, THREE_ROUTE_XTZ_TOKEN } from 'src/token/data/three-route-tokens';

export const DEFAULT_LIQUIDITY_BAKING_SUBSIDY = new BigNumber(1250000);
export const DEFAULT_MINIMAL_BLOCK_DELAY = new BigNumber(15);
export const liquidityBakingStakingId = 'lb';

export const THREE_ROUTE_LB_TOKENS = [THREE_ROUTE_XTZ_TOKEN, THREE_ROUTE_TZBTC_TOKEN];

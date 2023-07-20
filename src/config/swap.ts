import { BigNumber } from 'bignumber.js';

import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { Route3Token } from 'src/interfaces/route3.interface';

export const ROUTING_FEE_ADDRESS = 'tz1XYSt74vwVWgixEXdiS4C5t3UvuExRRTZR';
export const BURN_ADDREESS = 'tz1burnburnburnburnburnburnburjAYjjX';

export const ROUTE3_CONTRACT = 'KT1R7WEtNNim3YgkxPt8wPMczjH3eyhbJMtz';
export const LIQUIDITY_BAKING_PROXY_CONTRACT = 'KT1WLWMMm9MywjCqnA8wBAYy9QhUE1LzfZ4j';

export const ROUTING_FEE_PERCENT = 0.35;
export const CASHBACK_PERCENT = 0.175;
export const ROUTING_FEE_RATIO = (100 - ROUTING_FEE_PERCENT) / 100;
export const ROUTING_FEE_SLIPPAGE_RATIO = 0.99;
export const ZERO = new BigNumber(0);
export const MAX_ROUTING_FEE_CHAINS = 1;
export const SWAP_THRESHOLD_TO_GET_CASHBACK = 10;
export const ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT = 286; // ceil(1 / 0.0035)

export const TEMPLE_TOKEN: Route3Token = {
  id: 138,
  symbol: 'TKEY',
  standard: Route3TokenStandardEnum.fa2,
  contract: 'KT1VaEsVNiBoA56eToEK6n6BcPgh1tdx9eXi',
  tokenId: '0',
  decimals: 18
};

export const APP_ID = 2;

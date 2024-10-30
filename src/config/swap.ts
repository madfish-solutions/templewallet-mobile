import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { Route3Token } from 'src/interfaces/route3.interface';

export const ROUTING_FEE_ADDRESS = 'tz1XYSt74vwVWgixEXdiS4C5t3UvuExRRTZR';

export const ROUTE3_CONTRACT = 'KT1V5XKmeypanMS9pR65REpqmVejWBZURuuT';
export const LIQUIDITY_BAKING_PROXY_CONTRACT = 'KT1DJRF7pTocLsoVgA9KQPBtrDrbzNUceSFK';

export const ROUTING_FEE_RATIO = 0.006;
export const CASHBACK_RATIO = 0.003;
export const ROUTING_FEE_SLIPPAGE_RATIO = 0.99;
export const SWAP_THRESHOLD_TO_GET_CASHBACK = 10;

/** The measure of acceptable deviation of an input for cashback swap or an amount of tokens to burn or to send to
 * `ROUTING_FEE_ADDRESS` from ideal caused by the discretion of tokens values.
 */
const MAX_FEE_OR_CASHBACK_DEVIATION_RATIO = 0.01;

export const ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT = Math.ceil(
  1 / MAX_FEE_OR_CASHBACK_DEVIATION_RATIO / Math.min(CASHBACK_RATIO, ROUTING_FEE_RATIO - CASHBACK_RATIO)
);

// These values have been set after some experimentation
export const SINGLE_SWAP_IN_BATCH_MAX_DEXES = 12;
const LB_OPERATION_DEXES_COST = 2;
export const SINGLE_SIRS_SWAP_MAX_DEXES = SINGLE_SWAP_IN_BATCH_MAX_DEXES - LB_OPERATION_DEXES_COST;

export const TEMPLE_TOKEN: Route3Token = {
  id: 138,
  symbol: 'TKEY',
  standard: Route3TokenStandardEnum.fa2,
  contract: 'KT1VaEsVNiBoA56eToEK6n6BcPgh1tdx9eXi',
  tokenId: '0',
  decimals: 18
};

export const APP_ID = 2;

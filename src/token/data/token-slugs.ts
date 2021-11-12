import { getTokenSlug } from '../utils/token.utils';
const LIQUIDITY_BAKING_LP_TOKEN_ADDRESS = 'KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo';
const LIQUIDITY_BAKING_LP_TOKEN_ID = 0;

export const LIQUIDITY_BAKING_LP_SLUG = getTokenSlug({
  address: LIQUIDITY_BAKING_LP_TOKEN_ADDRESS,
  id: LIQUIDITY_BAKING_LP_TOKEN_ID
});

const TZ_BTC_TOKEN_ADDRESS = 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn';
const TZ_BTC_TOKEN_ID = 0;

export const TZ_BTC_TOKEN_SLUG = getTokenSlug({
  address: TZ_BTC_TOKEN_ADDRESS,
  id: TZ_BTC_TOKEN_ID
});

import { getTokenSlug } from '../utils/token.utils';

export const SIRS_TOKEN_ADDRESS = 'KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo';
export const SIRS_TOKEN_ID = 0;

export const SIRS_SLUG = getTokenSlug({
  address: SIRS_TOKEN_ADDRESS,
  id: SIRS_TOKEN_ID
});

const TZ_BTC_TOKEN_ADDRESS = 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn';
const TZ_BTC_TOKEN_ID = 0;

export const TZ_BTC_SLUG = getTokenSlug({
  address: TZ_BTC_TOKEN_ADDRESS,
  id: TZ_BTC_TOKEN_ID
});

export const LIQUIDITY_BAKING_DEX_ADDRESS = 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5';

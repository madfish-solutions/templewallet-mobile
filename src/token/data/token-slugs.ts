import { getTokenSlug, toTokenSlug } from '../utils/token.utils';

import { TEMPLE_TOKEN } from './tokens-metadata';

export const SIRS_TOKEN = {
  address: 'KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo',
  id: 0
};

export const KNOWN_TOKENS_SLUGS: Record<string, string> = {
  tzBTC: toTokenSlug('KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn', 0),
  KUSD: toTokenSlug('KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV', 0),
  uUSD: toTokenSlug('KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW', 0),
  QUIPU: toTokenSlug('KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb', 0),
  wWBTC: toTokenSlug('KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ', 19),
  USDT: toTokenSlug('KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o', 0),
  uBTC: toTokenSlug('KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW', 2),
  YOU: toTokenSlug('KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL', 0),
  SIRS: getTokenSlug(SIRS_TOKEN)
};

export const KNOWN_STABLECOINS_SLUGS = [KNOWN_TOKENS_SLUGS.KUSD, KNOWN_TOKENS_SLUGS.uUSD, KNOWN_TOKENS_SLUGS.USDT];

export const LIQUIDITY_BAKING_DEX_ADDRESS = 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5';

export const TEMPLE_TOKEN_SLUG = toTokenSlug(TEMPLE_TOKEN.address, TEMPLE_TOKEN.id);

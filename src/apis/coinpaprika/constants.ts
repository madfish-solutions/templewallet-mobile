/** Internal market-token id used for Tezos. Kept for persisted favorites compatibility. */
export const TEZOS_MARKET_TOKEN_ID = 'tezos';

export const COINPAPRIKA_TEZOS_ID = 'xtz-tezos';

/**
 * Maps legacy CoinGecko ids (still returned by Temple `/top-coins`) to Coinpaprika ids.
 * If `/top-coins` starts returning Coinpaprika ids, those keys are used as-is.
 */
export const COINGECKO_ID_TO_COINPAPRIKA_ID: StringRecord = {
  [TEZOS_MARKET_TOKEN_ID]: COINPAPRIKA_TEZOS_ID,
  tether: 'usdt-tether',
  dogami: 'doga-dogam',
  upsorber: 'up-upsorber',
  'kolibri-usd': 'kusd-kolibri-usd',
  'staker-dao': 'wxtz-stakerdaowrappedtezos',
  'wrapped-tezos': 'wxtz-wrapped-tezos',
  'crunchy-dao': 'crdao-crunchydao',
  'crunchy-network': 'crunch-crunchy',
  'weth-plenty-bridge': 'wethp-weth-plenty-bridge'
};

export const getCoinpaprikaLogoUrl = (coinId: string) => `https://static.coinpaprika.com/coin/${coinId}/logo.png`;

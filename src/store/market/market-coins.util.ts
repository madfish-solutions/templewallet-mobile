import { from, map } from 'rxjs';

import { coingeckoApi } from '../../api.service';
import { MarketCoin, MarketCoinRaw } from './market.interfaces';

const DEFAULT_PRECISION = 2;
const DEFAULT_VALUE = 0;
const TRESHOLD_TO_DISPLAY = 0.01;

export const loadMarketTopCoins$ = from(
  coingeckoApi.get<Array<MarketCoinRaw>>(
    'coins/markets?vs_currency=usd&category=tezos-ecosystem&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d'
  )
).pipe(
  map(({ data }) => {
    const mappedCoins: Array<MarketCoin> = [];

    for (const coinInfo of data) {
      const price_ = coinInfo.current_price === null ? 0 : coinInfo.current_price;

      mappedCoins.push({
        id: coinInfo.id,
        name: coinInfo.name,
        symbol: coinInfo.symbol.toUpperCase(),
        imageUrl: coinInfo.image,
        price:
          coinInfo.current_price !== null && coinInfo.current_price < TRESHOLD_TO_DISPLAY
            ? TRESHOLD_TO_DISPLAY
            : Number(price_.toFixed(DEFAULT_PRECISION)),
        priceChange7d: Number(
          coinInfo?.price_change_percentage_7d_in_currency?.toFixed(DEFAULT_PRECISION) ?? DEFAULT_VALUE
        ),
        priceChange24h: Number(
          coinInfo?.price_change_percentage_24h_in_currency?.toFixed(DEFAULT_PRECISION) ?? DEFAULT_VALUE
        ),
        volume24h: Number(coinInfo.total_volume?.toFixed(DEFAULT_PRECISION) ?? DEFAULT_VALUE),
        supply: Number(coinInfo.total_supply?.toFixed(DEFAULT_PRECISION) ?? DEFAULT_VALUE),
        marketCup: Number(coinInfo.market_cap?.toFixed(DEFAULT_PRECISION) ?? DEFAULT_VALUE)
      });
    }

    return mappedCoins;
  })
);

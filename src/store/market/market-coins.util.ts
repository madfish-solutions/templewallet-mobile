import { from, map } from 'rxjs';

import { coingeckoApi } from '../../api.service';
import { MarketCoin, MarketCoinRaw } from './market.interfaces';

export const loadMarketTopCoins$ = from(
  coingeckoApi.get<Array<MarketCoinRaw>>(
    'coins/markets?vs_currency=usd&category=tezos-ecosystem&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d'
  )
).pipe(
  map(({ data }) => {
    const mappedCoins: Array<MarketCoin> = [];

    for (const coinInfo of data) {
      mappedCoins.push({
        name: coinInfo.name,
        price: coinInfo.current_price,
        priceChange7d: coinInfo.price_change_percentage_7d_in_currency,
        priceChange24h: coinInfo.price_change_percentage_24h_in_currency,
        volume24h: coinInfo.total_volume,
        supply: coinInfo.total_supply,
        marketCup: coinInfo.market_cap
      });
    }

    return mappedCoins;
  })
);

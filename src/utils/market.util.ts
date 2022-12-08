import { from, map } from 'rxjs';

import { MarketCoin, MarketCoinRaw } from '../store/market/market.interfaces';
import { Colors } from '../styles/colors';
import { coingeckoApi } from './../api.service';

export const loadMarketTopCoins$ = from(
  coingeckoApi.get<Array<MarketCoinRaw>>(
    'coins/markets?vs_currency=usd&category=tezos-ecosystem&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d'
  )
).pipe(
  map(({ data }) => {
    const mappedCoins: Array<MarketCoin> = [];

    for (const coinInfo of data) {
      mappedCoins.push({
        id: coinInfo.id,
        name: coinInfo.name,
        symbol: coinInfo.symbol.toUpperCase(),
        imageUrl: coinInfo.image,
        price: coinInfo.current_price,
        priceChange7d: coinInfo?.price_change_percentage_7d_in_currency,
        priceChange24h: coinInfo?.price_change_percentage_24h_in_currency,
        volume24h: coinInfo.total_volume,
        supply: coinInfo.circulating_supply,
        marketCup: coinInfo.market_cap
      });
    }

    return mappedCoins;
  })
);

export const getValueToShow = (value: number | null | undefined, tezosExchangeRate?: number) => {
  const res: { value?: string; valueEstimatedInTezos?: string } = {};

  if (value === null || value === undefined) {
    res.value = '-';

    return res;
  }

  res.value = value < 0.01 ? '>0.01' : value.toFixed(2);

  if (tezosExchangeRate !== undefined) {
    const valueInTezos = value / tezosExchangeRate;
    res.valueEstimatedInTezos = valueInTezos < 0.01 ? '>0.01' : valueInTezos.toFixed(2);
  }

  return res;
};

export const getPriceChange = (value: number | null | undefined) => {
  return value === null || value === undefined ? '-' : `${value.toFixed(2)}%`;
};

export const getColor = (value: number | null | undefined, colors: Colors) => {
  if (value === null || value === undefined || value === 0) {
    return colors.black;
  } else if (value > 0) {
    return colors.adding;
  } else if (value < 0) {
    return colors.destructive;
  }

  return colors.black;
};

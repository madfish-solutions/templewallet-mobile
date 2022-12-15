import { from, map } from 'rxjs';

import { MarketCoinsSortFieldEnum } from '../enums/market-coins-sort-field.enum';
import { MarketCoin, MarketCoinRaw } from '../store/market/market.interfaces';
import { Colors } from '../styles/colors';
import { coingeckoApi, templeWalletApi } from './../api.service';

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

export const loadMarketCoinsSlugs$ = from(templeWalletApi.get<Record<string, string>>('/top-coins')).pipe(
  map(value => value.data)
);

const si = [
  { value: 1e3, letter: 'K' },
  { value: 1e6, letter: 'M' },
  { value: 1e9, letter: 'B' },
  { value: 1e12, letter: 'T' },
  { value: 1e15, letter: 'P' },
  { value: 1e18, letter: 'E' }
];

const formatNumber = (value: number) => {
  if (value < 10000) {
    if (value % 1 === 0) {
      return value.toFixed(0);
    }

    return value.toFixed(2);
  }

  let index;
  for (index = si.length - 1; index > 0; index--) {
    if (value >= si[index].value) {
      break;
    }
  }

  return (value / si[index].value).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[index].letter;
};

export const getValueToShow = (value: number | null | undefined, tezosExchangeRate?: number) => {
  const res: { value?: string; valueEstimatedInTezos?: string } = {};

  if (value === null || value === undefined) {
    res.value = '-';

    return res;
  }

  res.value = value < 0.01 ? '>0.01' : formatNumber(value);

  if (tezosExchangeRate !== undefined) {
    const valueInTezos = value / tezosExchangeRate;
    res.valueEstimatedInTezos = valueInTezos < 0.01 ? '>0.01' : formatNumber(valueInTezos);
  }

  return res;
};

export const getPriceChange = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return '-';
  }

  if (value > 0) {
    return `+${value.toFixed(2)}%`;
  } else {
    return `${value.toFixed(2)}%`;
  }
};

export const getPriceChangeColor = (value: number | null | undefined, colors: Colors) => {
  if (value === null || value === undefined || value === 0) {
    return colors.black;
  } else if (value > 0) {
    return colors.adding;
  } else if (value < 0) {
    return colors.destructive;
  }

  return colors.black;
};

const sortByDescending = (a: number | null, b: number | null) => {
  if (a === null) {
    return 1;
  } else if (b === null) {
    return -1;
  } else if (a > b) {
    return -1;
  } else if (a < b) {
    return 1;
  } else {
    return 0;
  }
};

export const sortMarketCoins = (marketCoins: Array<MarketCoin>, sortField: MarketCoinsSortFieldEnum) => {
  switch (sortField) {
    case MarketCoinsSortFieldEnum.Price:
      return marketCoins.sort((a, b) => {
        return sortByDescending(a.price, b.price);
      });

    case MarketCoinsSortFieldEnum.Volume:
      return marketCoins.sort((a, b) => {
        return sortByDescending(a.volume24h, b.volume24h);
      });

    case MarketCoinsSortFieldEnum.PriceChange:
      return marketCoins.sort((a, b) => {
        return sortByDescending(a.priceChange24h, b.priceChange24h);
      });

    default:
      return marketCoins;
  }
};

export interface MarketCoin {
  name: string;
  price: number;
  priceChange7d: number;
  priceChange24h: number;
  volume24h: number;
  supply: number | null;
  marketCup: number;
}

interface Roi {
  times: number;
  currency: string;
  percentage: number;
}

export interface MarketCoinRaw {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: Date;
  atl: number;
  atl_change_percentage: number;
  atl_date: Date;
  roi: Roi;
  last_updated: Date;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
}

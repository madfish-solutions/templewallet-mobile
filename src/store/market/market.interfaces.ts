import { Roi } from 'src/interfaces/roi.interface';

export interface MarketToken {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  price: number | null;
  priceChange7d: number | null;
  priceChange24h: number | null;
  volume24h: number | null;
  supply: number | null;
  marketCap: number | null;
}

export interface MarketTokenRaw {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number | null;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number | null;
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
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
}

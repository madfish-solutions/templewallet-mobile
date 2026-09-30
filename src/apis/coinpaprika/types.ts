type CoinpaprikaNumericValue = number | string | null;

export interface CoinpaprikaQuote {
  price?: CoinpaprikaNumericValue;
  volume_24h?: CoinpaprikaNumericValue;
  market_cap?: CoinpaprikaNumericValue;
  percent_change_24h?: CoinpaprikaNumericValue;
  percent_change_7d?: CoinpaprikaNumericValue;
}

export interface CoinpaprikaTicker {
  id: string;
  name: string;
  symbol: string;
  circulating_supply?: CoinpaprikaNumericValue;
  total_supply?: CoinpaprikaNumericValue;
  quotes?: {
    USD?: CoinpaprikaQuote;
  };
}

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

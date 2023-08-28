export interface KordFiResponse {
  user: string;
  xtz: {
    apy: number;
    total_supplied_usd: number;
    total_borrowed_usd: number;
    user_deposite_usd: number;
  };
  tzbtc: {
    apy: number;
    total_supplied_usd: number;
    total_borrowed_usd: number;
    user_deposite_usd: number;
  };
  total: {
    user_apy: number;
    user_deposite: number;
  };
}

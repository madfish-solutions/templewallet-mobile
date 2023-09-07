export interface KordFiStatsResponse {
  xtz_apy: number;
  xtz_total_supply_usd: number;
  xtz_total_borrow_usd: number;
  xtz_tvl_usd: number;
  tzbtc_apy: number;
  tzbtc_total_supply_usd: number;
  tzbtc_total_borrow_usd: number;
  tzbtc_tvl_usd: number;
  tvl_usd: number;
}

export interface KordFiUserDepositsResponse {
  xtz_deposit: number;
  xtz_deposit_usd: number;
  tzbtc_deposit: number;
  tzbtc_deposit_usd: number;
  current_savings_amount: number;
}

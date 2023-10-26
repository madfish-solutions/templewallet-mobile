export interface KordFiStatsResponse {
  xtz_apr: number;
  xtz_total_supply_usd: number;
  xtz_total_borrow_usd: number;
  tzbtc_apr: number;
  tzbtc_total_supply_usd: number;
  tzbtc_total_borrow_usd: number;
  tvl_usd: number;
}

export interface KordFiUserDepositsResponse {
  xtz_deposit: number;
  xtz_deposit_usd: number;
  tzbtc_deposit: number;
  tzbtc_deposit_usd: number;
  current_savings_amount: number;
}

export interface KordFiLendStats {
  xtzApr: number;
  xtzTotalSupplyUsd: number;
  xtzTotalBorrowUsd: number;
  tzbtcApr: number;
  tzbtcTotalSupplyUsd: number;
  tzbtcTotalBorrowUsd: number;
  tvlUsd: number;
}

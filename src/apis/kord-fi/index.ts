import axios from 'axios';
import { Observable, from, map } from 'rxjs';

import { KordFiLendStats, KordFiLendUserInfo } from 'src/interfaces/earn-opportunity/savings-item.interface';

import { KordFiStatsResponse, KordFiUserDepositsResponse } from './types';

const kordFiApi = axios.create({
  baseURL: 'https://back-llb-beta.kord.fi'
});

export const getKordFiStats$ = (address: string): Observable<KordFiLendStats> =>
  from(kordFiApi.post<KordFiStatsResponse>('/llb-api/lend-stats/', { address })).pipe(
    map(
      ({
        data: {
          xtz_apy,
          xtz_total_supply_usd,
          xtz_total_borrow_usd,
          xtz_tvl_usd,
          tzbtc_apy,
          tzbtc_total_supply_usd,
          tzbtc_total_borrow_usd,
          tzbtc_tvl_usd,
          tvl_usd
        }
      }) => ({
        xtzApy: xtz_apy,
        xtzTotalSupplyUsd: xtz_total_supply_usd,
        xtzTotalBorrowUsd: xtz_total_borrow_usd,
        xtzTvlUsd: xtz_tvl_usd,
        tzbtcApy: tzbtc_apy,
        tzbtcTotalSupplyUsd: tzbtc_total_supply_usd,
        tzbtcTotalBorrowUsd: tzbtc_total_borrow_usd,
        tzbtcTvlUsd: tzbtc_tvl_usd,
        tvlUsd: tvl_usd
      })
    )
  );

export const getKordFiUserDeposits$ = (address: string): Observable<KordFiLendUserInfo> =>
  from(kordFiApi.post<KordFiUserDepositsResponse>('/llb-api/lend-stats/', { address })).pipe(
    map(({ data: { xtz_deposit, xtz_deposit_usd, tzbtc_deposit, tzbtc_deposit_usd, current_savings_amount } }) => ({
      xtzDeposit: xtz_deposit,
      xtzDepositUsd: xtz_deposit_usd,
      tzbtcDeposit: tzbtc_deposit,
      tzbtcDepositUsd: tzbtc_deposit_usd,
      currentSavingsAmount: current_savings_amount
    }))
  );

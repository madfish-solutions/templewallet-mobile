import axios from 'axios';
import { from, map } from 'rxjs';

import { KordFiResponse } from './types';

const kordFiApi = axios.create({
  baseURL: 'https://back-llb-beta.kord.fi'
});
export const getKordFiItems$ = (address: string) =>
  from(kordFiApi.post<KordFiResponse>('/llb-api/user-deposits/', { address })).pipe(
    map(({ data: { user, xtz, tzbtc, total } }) => ({
      user,
      xtz: {
        apy: xtz.apy,
        totalSuppliedUsd: xtz.total_supplied_usd,
        totalBorrowedUsd: xtz.total_borrowed_usd,
        userDepositeUsd: xtz.user_deposite_usd
      },
      tzbtc: {
        apy: tzbtc.apy,
        totalSuppliedUsd: tzbtc.total_supplied_usd,
        totalBorrowedUsd: tzbtc.total_borrowed_usd,
        userDepositeUsd: tzbtc.user_deposite_usd
      },
      total: {
        userApy: total.user_apy,
        userDeposite: total.user_deposite
      }
    }))
  );

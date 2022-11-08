import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { TZ_BTC_TOKEN_SLUG } from '../../token/data/token-slugs';
import { apolloConfigurableClient } from './apollo-configurable-client';
import { getTzBtcApyQuery } from './queries';

interface GetTzBtcApy {
  contractInfo: [{ tzbtcDepositRate: number }];
}

export const getTzBtcApy$ = () =>
  apolloConfigurableClient.query<GetTzBtcApy>(getTzBtcApyQuery).pipe(
    map(data => {
      const { tzbtcDepositRate = 0 } = data?.contractInfo?.[0] ?? {};

      return { [TZ_BTC_TOKEN_SLUG]: Number(tzbtcDepositRate.toFixed(2)) };
    }),
    catchError(() => of({ [TZ_BTC_TOKEN_SLUG]: 0 }))
  );

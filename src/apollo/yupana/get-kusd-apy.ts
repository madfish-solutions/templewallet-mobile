import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { KUSD_SLUG } from '../../token/data/token-slugs';
import { apolloConfigurableClient } from './apollo-configurable-client.ts';
import { getKUSDApyQuery } from './queries';

interface GetKUSDApy {
  asset: [{ rates: { supply_apy: string }[] }];
}

export const getKUSDApy$ = () =>
  apolloConfigurableClient.query<GetKUSDApy>(getKUSDApyQuery).pipe(
    map(data => {
      const { rates } = data.asset[0];
      const { supply_apy } = rates[0];
      const apy = Number(supply_apy) / 10000000000000000;

      return {
        [KUSD_SLUG]: Number(apy.toFixed(2))
      };
    }),
    catchError(() => of({ [KUSD_SLUG]: 0 }))
  );

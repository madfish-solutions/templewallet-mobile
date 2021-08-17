import { useEffect, useState } from 'react';
import { from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { isDefined } from '../../../../utils/is-defined';
import { tezos$ } from '../../../../utils/network/network.util';

export const useAccountManagerKey = (accountPublicKeyHash: string) => {
  const [data, setData] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscription = from(tezos$.getValue().rpc.getManagerKey(accountPublicKeyHash))
      .pipe(
        map(manager => (isDefined(manager) && typeof manager === 'object' ? manager.key : manager)),
        catchError(() => of(undefined))
      )
      .subscribe(value => {
        setIsLoading(false);
        setData(value);
      });

    return () => subscription.unsubscribe();
  }, []);

  return { data, isLoading };
};

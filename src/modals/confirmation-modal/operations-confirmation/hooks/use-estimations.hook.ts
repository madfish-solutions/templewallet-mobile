import { useEffect, useState } from 'react';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { EstimationInterface } from '../../../../interfaces/estimation.interface';
import { ParamsWithKind } from '../../../../interfaces/op-params.interface';
import { WalletAccountInterface } from '../../../../interfaces/wallet-account.interface';
import { showErrorToast } from '../../../../toast/toast.utils';
import { tezos$ } from '../../../../utils/network/network.util';

export const useEstimations = (sender: WalletAccountInterface, opParams: ParamsWithKind[]) => {
  const [data, setData] = useState<EstimationInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscription = of(null)
      .pipe(
        withLatestFrom(tezos$, (_, tezos) => tezos),
        switchMap(tezos => tezos.estimate.batch(opParams.map(param => ({ ...param, source: sender.publicKeyHash })))),
        map(estimates =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          estimates.map(({ suggestedFeeMutez, gasLimit, storageLimit, minimalFeePerStorageByteMutez }: any) => ({
            suggestedFeeMutez,
            gasLimit,
            storageLimit,
            minimalFeePerStorageByteMutez
          }))
        ),
        catchError(() => {
          showErrorToast({ description: 'Warning! The transaction is likely to fail!' });

          return of([]);
        })
      )
      .subscribe(value => {
        setIsLoading(false);
        setData(value);
      });

    return () => subscription.unsubscribe();
  }, []);

  return { data, isLoading };
};

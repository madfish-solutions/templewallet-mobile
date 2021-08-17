import { useEffect, useState } from 'react';
import { from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EstimationInterface } from '../../../../interfaces/estimation.interface';
import { ParamsWithKind } from '../../../../interfaces/op-params.interface';
import { WalletAccountInterface } from '../../../../interfaces/wallet-account.interface';
import { showErrorToast } from '../../../../toast/toast.utils';
import { tezosToolkit$ } from '../../../../utils/network/tezos-toolkit.utils';

export const useEstimations = (sender: WalletAccountInterface, opParams: ParamsWithKind[]) => {
  const [data, setData] = useState<EstimationInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscription = from(
      tezosToolkit$.getValue().estimate.batch(opParams.map(param => ({ ...param, source: sender.publicKeyHash })))
    )
      .pipe(
        map(estimates =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          estimates.map(({ suggestedFeeMutez, gasLimit, storageLimit, minimalFeePerStorageByteMutez }: any) => ({
            suggestedFeeMutez,
            gasLimit,
            storageLimit,
            minimalFeePerStorageByteMutez
          }))
        ),
        catchError(err => {
          console.log({ err });
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

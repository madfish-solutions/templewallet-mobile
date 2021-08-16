import { useEffect, useState } from 'react';
import { from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EstimationInterface } from '../../../../interfaces/estimation.interface';
import { ParamsWithKind } from '../../../../interfaces/op-params.interface';
import { WalletAccountInterface } from '../../../../interfaces/wallet-account.interface';
import { showErrorToast } from '../../../../toast/toast.utils';
import { tezos$ } from '../../../../utils/network/network.util';

export const useEstimations = (
  sender: WalletAccountInterface,
  opParams: ParamsWithKind[],
  shouldShowErrorToast = true
) => {
  const [data, setData] = useState<EstimationInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscription = from(
      tezos$.getValue().estimate.batch(opParams.map(param => ({ ...param, source: sender.publicKeyHash })))
    )
      .pipe(
        map(estimates =>
          estimates.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ({ suggestedFeeMutez, gasLimit, storageLimit, minimalFeePerStorageByteMutez, totalCost }: any) => ({
              suggestedFeeMutez,
              gasLimit,
              storageLimit,
              minimalFeePerStorageByteMutez,
              totalCost
            })
          )
        ),
        catchError(() => {
          if (shouldShowErrorToast) {
            showErrorToast({ description: 'Warning! The transaction is likely to fail!' });
          }

          return of([]);
        })
      )
      .subscribe(value => {
        setIsLoading(false);
        setData(value);
      });

    return () => subscription.unsubscribe();
  }, [sender.publicKeyHash, opParams]);

  return { data, isLoading };
};

import * as Sentry from '@sentry/react-native';
import { ParamsWithKind } from '@taquito/taquito';
import { useEffect, useState } from 'react';
import { from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { useReadOnlyTezosToolkit } from '../../../../hooks/use-read-only-tezos-toolkit.hook';
import { AccountInterface } from '../../../../interfaces/account.interface';
import { EstimationInterface } from '../../../../interfaces/estimation.interface';
import { showErrorToast } from '../../../../toast/toast.utils';

export const useEstimations = (sender: AccountInterface, opParams: ParamsWithKind[]) => {
  const [data, setData] = useState<EstimationInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tezos = useReadOnlyTezosToolkit(sender);

  useEffect(() => {
    const subscription = from(tezos.estimate.batch(opParams.map(param => ({ ...param, source: sender.publicKeyHash }))))
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
        catchError(error => {
          Sentry.captureException(error);
          showErrorToast({
            title: 'Warning!',
            description: 'The transaction is likely to fail!',
            estimationError: error.toString()
          });

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

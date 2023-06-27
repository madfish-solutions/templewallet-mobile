import * as Sentry from '@sentry/react-native';
import { OpKind, ParamsWithKind, Estimate } from '@taquito/taquito';
import { pick } from 'lodash-es';
import { useEffect, useState } from 'react';
import { from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { AccountInterface } from 'src/interfaces/account.interface';
import { EstimationInterface } from 'src/interfaces/estimation.interface';
import { showErrorToast } from 'src/toast/toast.utils';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';

/** From @taquito/taquito */
const MINIMAL_FEE_PER_GAS_MUTEZ = 0.1;

export const useEstimations = (sender: AccountInterface, opParams: ParamsWithKind[]) => {
  const [data, setData] = useState<EstimationInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tezos = useReadOnlyTezosToolkit(sender);

  useEffect(() => {
    const subscription = from(tezos.estimate.batch(opParams.map(param => ({ ...param, source: sender.publicKeyHash }))))
      .pipe(
        map(estimates =>
          estimates.map((estimate, i) => ({
            ...pick(estimate, 'gasLimit', 'storageLimit'),
            suggestedFeeMutez: getSuggestedFeeMutez(estimate, opParams[i]),
            // @ts-ignore
            minimalFeePerStorageByteMutez: Number(estimate.minimalFeePerStorageByteMutez)
          }))
        ),
        catchError(error => {
          Sentry.captureException(error);
          showErrorToast({
            title: 'Warning!',
            description: 'The transaction is likely to fail!',
            isCopyButtonVisible: true,
            onPress: () => copyStringToClipboard(error.toString())
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

const getSuggestedFeeMutez = (estimate: Estimate, opParam?: ParamsWithKind) => {
  if (
    !isDefined(opParam) ||
    opParam.kind === OpKind.ACTIVATION ||
    !isTruthy(opParam.gasLimit) ||
    opParam.gasLimit <= estimate.gasLimit
  ) {
    return estimate.suggestedFeeMutez;
  }

  /*
    We want to respect dApp's `gasLimit` value, if it's greater than our estimate's.

    Calculation of `estimate.gasLimit` is based on `consumed_milligas` value, and does not change on increasing `opParam.gasLimit`.
    Calculation of `estimate.minimalFeeMutez` is in linear dependency with `estimate.gasLimit`.
  */
  const diff = Math.ceil((opParam.gasLimit - estimate.gasLimit) * MINIMAL_FEE_PER_GAS_MUTEZ);

  return estimate.minimalFeeMutez + diff;
};

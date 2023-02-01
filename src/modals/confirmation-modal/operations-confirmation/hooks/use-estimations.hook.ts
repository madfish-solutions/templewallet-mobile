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

const FEE_PER_GAS_UNIT = 0.1;

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
            suggestedFeeMutez: estimate.suggestedFeeMutez + getSuggestedFeeMutezCorrection(estimate, opParams[i]),
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

const getSuggestedFeeMutezCorrection = (estimate: Estimate, opParam?: ParamsWithKind) => {
  if (opParam == null || opParam.kind === OpKind.ACTIVATION || opParam.gasLimit == null) {
    return 0;
  }

  return opParam.gasLimit ? Math.ceil((opParam.gasLimit - estimate.gasLimit) * FEE_PER_GAS_UNIT) : 0;
};

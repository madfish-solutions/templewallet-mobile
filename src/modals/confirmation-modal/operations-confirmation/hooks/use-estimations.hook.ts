import * as Sentry from '@sentry/react-native';
import { OpKind, ParamsWithKind, Estimate, TezosOperationError } from '@taquito/taquito';
import { pick } from 'lodash-es';
import { useEffect, useState } from 'react';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { AccountInterface } from 'src/interfaces/account.interface';
import { EstimationInterface } from 'src/interfaces/estimation.interface';
import { LoadableEntityState } from 'src/store/types';
import { showErrorToast } from 'src/toast/toast.utils';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isDefined } from 'src/utils/is-defined';

/** From @taquito/taquito */
const MINIMAL_FEE_PER_GAS_MUTEZ = 0.1;

export const useEstimations = (sender: AccountInterface, opParams: ParamsWithKind[]) => {
  const [estimationState, setEstimationState] = useState<LoadableEntityState<EstimationInterface[]>>({
    isLoading: true,
    data: []
  });
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
        )
      )
      .subscribe({
        next: value => setEstimationState({ isLoading: false, data: value }),
        error: error => {
          Sentry.captureException(error);
          showErrorToast({
            title: 'Warning!',
            description: 'The transaction is likely to fail!',
            isCopyButtonVisible: true,
            onPress: () => copyStringToClipboard(error.toString())
          });

          setEstimationState({
            error: error instanceof TezosOperationError ? error.id : error.toString(),
            isLoading: false,
            data: []
          });
        }
      });

    return () => subscription.unsubscribe();
  }, []);

  return estimationState;
};

const getSuggestedFeeMutez = (estimate: Estimate, opParam?: ParamsWithKind) => {
  if (
    !(opParam && opParam.kind) ||
    opParam.kind === OpKind.ACTIVATION ||
    opParam.kind === OpKind.FAILING_NOOP ||
    !isDefined(opParam.gasLimit) ||
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

  return estimate.suggestedFeeMutez + diff;
};

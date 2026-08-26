import { OpKind } from '@taquito/rpc';
import { ParamsWithKind, Estimate, TezosOperationError, GasConsumingOperation } from '@taquito/taquito';
import { pick } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { EstimationInterface } from 'src/interfaces/estimation.interface';
import { LoadableEntityState } from 'src/store/types';
import { showErrorToast } from 'src/toast/toast.utils';
import { TezosReadOnlySignerPayload } from 'src/types/tezos-read-only-signer-payload';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isDefined } from 'src/utils/is-defined';
import { MINIMAL_FEE_PER_GAS_MUTEZ } from 'src/utils/tezos.util';

export const useEstimations = (sender: TezosReadOnlySignerPayload, opParams: ParamsWithKind[]) => {
  const [estimationState, setEstimationState] = useState<LoadableEntityState<EstimationInterface[], unknown>>({
    isLoading: true,
    data: []
  });
  const tezos = useReadOnlyTezosToolkit(sender);
  const senderTezosAddress = sender.address;

  const estimate$ = useCallback(
    (
      currentOpParams: ParamsWithKind[],
      attemptCounter = 0,
      prevFailedOperationIndex = -1
    ): Observable<EstimationInterface[]> =>
      from(tezos.estimate.batch(currentOpParams.map(param => ({ ...param, source: senderTezosAddress })))).pipe(
        map(estimates =>
          estimates.map((estimate, i) => ({
            ...pick(estimate, 'gasLimit', 'storageLimit'),
            suggestedFeeMutez: getSuggestedFeeMutez(estimate, currentOpParams[i]),
            // @ts-expect-error: accessing private property
            minimalFeePerStorageByteMutez: Number(estimate.minimalFeePerStorageByteMutez)
          }))
        ),
        catchError(error => {
          if (
            error instanceof TezosOperationError &&
            error.errors.some(internalError => internalError.id.includes('gas_exhausted'))
          ) {
            const { operationsWithResults } = error;
            // Taquito auto-prepends reveal op for unrevealed accounts, so "operationsWithResults" can
            // be one longer than "currentOpParams", offset the index back into "currentOpParams" space.
            const revealOffset = operationsWithResults.length - currentOpParams.length;
            const firstSkippedOperationIndex = operationsWithResults.findIndex(
              op =>
                'metadata' in op &&
                'operation_result' in op.metadata &&
                op.metadata.operation_result.status === 'skipped'
            );
            // An internal operation of this operation may be marked as failed but this one as backtracked
            const failedResultIndex =
              firstSkippedOperationIndex === -1 ? operationsWithResults.length - 1 : firstSkippedOperationIndex - 1;
            const failedOperationIndex = failedResultIndex - revealOffset;
            const failedOperationWithResult = operationsWithResults[failedResultIndex];
            if (
              (revealOffset === 0 || revealOffset === 1) &&
              failedOperationIndex >= 0 &&
              failedOperationWithResult &&
              'gas_limit' in failedOperationWithResult
            ) {
              const newOpParams = Array.from(currentOpParams);
              const failedOperation = newOpParams[failedOperationIndex] as GasConsumingOperation;
              failedOperation.gasLimit =
                Math.max(failedOperation.gasLimit ?? 0, Number(failedOperationWithResult.gas_limit)) * 2;

              if (attemptCounter < 3) {
                return estimate$(
                  newOpParams,
                  failedOperationIndex > prevFailedOperationIndex ? 0 : attemptCounter + 1,
                  Math.max(failedOperationIndex, prevFailedOperationIndex)
                );
              }
            }
          }

          return from(Promise.reject(error));
        })
      ),
    [senderTezosAddress, tezos]
  );

  useEffect(() => {
    const subscription = estimate$(opParams).subscribe({
      next: value => setEstimationState({ isLoading: false, data: value }),
      error: error => {
        showErrorToast({
          title: 'Warning!',
          description: 'The transaction is likely to fail!',
          isCopyButtonVisible: true,
          onPress: () => copyStringToClipboard(error.toString())
        });

        setEstimationState({ error, isLoading: false, data: [] });
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

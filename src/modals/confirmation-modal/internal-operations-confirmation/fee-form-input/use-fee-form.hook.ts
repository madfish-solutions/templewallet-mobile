import { WalletParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { object } from 'yup';

import { bigNumberValidation } from '../../../../form/validation/big-number';
import { EstimationInterface } from '../../../../interfaces/estimation.interface';
import { isDefined } from '../../../../utils/is-defined';
import { mutezToTz } from '../../../../utils/tezos.util';

export const useFeeForm = (opParams: WalletParamsWithKind[], estimationsList: EstimationInterface[]) => {
  const { basicFees, estimationWasSuccessful, minimalFeePerStorageByteMutez, onlyOneOperation } = useMemo(() => {
    const estimationWasSuccessful = estimationsList.length > 0;
    const minimalFeePerStorageByteMutez = estimationWasSuccessful
      ? estimationsList[0].minimalFeePerStorageByteMutez
      : 0;
    const onlyOneOperation = opParams.length === 1;

    const basicFees = estimationsList.reduce(
      (prev, estimation) => ({
        gasFeeSum: prev.gasFeeSum.plus(mutezToTz(new BigNumber(estimation.suggestedFeeMutez), 6)),
        storageLimitSum: prev.storageLimitSum.plus(new BigNumber(estimation.storageLimit))
      }),
      {
        gasFeeSum: new BigNumber(0),
        storageLimitSum: new BigNumber(0)
      }
    );

    return { basicFees, estimationWasSuccessful, minimalFeePerStorageByteMutez, onlyOneOperation };
  }, [estimationsList]);

  const { formValidationSchema, formInitialValues } = useMemo(
    () => ({
      formInitialValues: estimationWasSuccessful ? basicFees : {},
      formValidationSchema: object().shape({
        gasFeeSum: bigNumberValidation.clone().test('min-gas-fee', 'Gas fee is required', value => {
          if (estimationWasSuccessful) {
            return isDefined(value) && value instanceof BigNumber && value.gte(0);
          }

          return true;
        }),
        storageLimitSum: bigNumberValidation
          .clone()
          .test('required-if-only-one-operation', 'Storage limit is required', value => {
            console.log(value);
            if (onlyOneOperation && estimationWasSuccessful) {
              return isDefined(value) && value instanceof BigNumber && value.gte(0);
            }

            return true;
          })
      })
    }),
    [basicFees]
  );

  return {
    basicFees,
    estimationWasSuccessful,
    minimalFeePerStorageByteMutez,
    onlyOneOperation,
    formValidationSchema,
    formInitialValues
  };
};

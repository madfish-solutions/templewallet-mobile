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
        gasFeeSum: bigNumberValidation
          .clone()
          .test('required-if-estimation-success', 'Gas fee is required', value => {
            if (estimationWasSuccessful) {
              return isDefined(value);
            }

            return true;
          })
          .test('min-gas-fee', `Minimal value is ${basicFees.gasFeeSum.toFixed()}`, value => {
            if (value instanceof BigNumber) {
              return value.gte(basicFees.gasFeeSum);
            }

            return false;
          }),
        storageLimitSum: bigNumberValidation
          .clone()
          .test('required-if-only-one-operation', 'Storage limit is required', value => {
            if (onlyOneOperation) {
              return isDefined(value);
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

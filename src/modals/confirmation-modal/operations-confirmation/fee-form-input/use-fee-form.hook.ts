import { OpKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { object } from 'yup';

import { bigNumberValidation } from '../../../../form/validation/big-number';
import { EstimationInterface } from '../../../../interfaces/estimation.interface';
import { ParamsWithKind } from '../../../../interfaces/op-params.interface';
import { isDefined } from '../../../../utils/is-defined';
import { mutezToTz } from '../../../../utils/tezos.util';

export const useFeeForm = (opParams: ParamsWithKind[], estimationsList: EstimationInterface[]) => {
  const {
    opParamsWithFees,
    basicFees,
    estimationWasSuccessful,
    minimalFeePerStorageByteMutez,
    onlyOneOperation,
    revealGasFee
  } = useMemo(() => {
    const estimationWasSuccessful = estimationsList.length > 0;
    const minimalFeePerStorageByteMutez = estimationWasSuccessful
      ? estimationsList[0].minimalFeePerStorageByteMutez
      : 0;
    const onlyOneOperation = opParams.length === 1;
    const withReveal = estimationsList.length === opParams.length + 1;

    const opParamsWithFees = estimationWasSuccessful
      ? opParams.map((opParam, i) => {
          const estimation = estimationsList[withReveal ? i + 1 : i];
          const {
            fee = estimation.suggestedFeeMutez,
            gasLimit = estimation.gasLimit,
            storageLimit = estimation.storageLimit
          } = opParam.kind !== OpKind.ACTIVATION ? opParam : {};

          return { ...opParam, fee, gasLimit, storageLimit };
        })
      : opParams;

    const basicFees = opParamsWithFees.reduce(
      (prev, opParam) => {
        const { fee = 0, storageLimit = 0 } = opParam.kind !== OpKind.ACTIVATION ? opParam : {};

        return {
          gasFeeSum: prev.gasFeeSum.plus(mutezToTz(new BigNumber(fee), 6)),
          storageLimitSum: prev.storageLimitSum.plus(new BigNumber(storageLimit))
        };
      },
      {
        gasFeeSum: new BigNumber(0),
        storageLimitSum: new BigNumber(0)
      }
    );

    const revealGasFee = withReveal ? estimationsList[0].suggestedFeeMutez : 0;

    if (withReveal) {
      basicFees.gasFeeSum = basicFees.gasFeeSum.plus(estimationsList[0].suggestedFeeMutez);
      basicFees.storageLimitSum = basicFees.storageLimitSum.plus(estimationsList[0].storageLimit);
    }

    return {
      opParamsWithFees,
      basicFees,
      estimationWasSuccessful,
      minimalFeePerStorageByteMutez,
      onlyOneOperation,
      revealGasFee
    };
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
    opParamsWithFees,
    basicFees,
    estimationWasSuccessful,
    minimalFeePerStorageByteMutez,
    onlyOneOperation,
    revealGasFee,
    formValidationSchema,
    formInitialValues
  };
};

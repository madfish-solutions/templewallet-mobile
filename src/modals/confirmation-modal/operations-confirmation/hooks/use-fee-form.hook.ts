import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { object } from 'yup';

import { bigNumberValidation } from 'src/form/validation/big-number';
import { EstimationInterface } from 'src/interfaces/estimation.interface';
import { mutezToTz } from 'src/utils/tezos.util';

export const useFeeForm = (opParams: ParamsWithKind[], estimationsList: EstimationInterface[]) => {
  const { basicFees, estimationsApplied, onlyOneOperation, ...restData } = useMemo(() => {
    const { finalParams, estimationsApplied, reveal } = applyEstimations(opParams, estimationsList);

    const { basicFees, revealGasFee } = calcBasicFees(finalParams, reveal);

    const minimalFeePerStorageByteMutez =
      estimationsList.length > 0 ? estimationsList[0].minimalFeePerStorageByteMutez : 0;

    const onlyOneOperation = opParams.length === 1;

    return {
      opParamsWithEstimations: finalParams,
      basicFees,
      estimationsApplied,
      minimalFeePerStorageByteMutez,
      onlyOneOperation,
      revealGasFee
    };
  }, [estimationsList]);

  const { formValidationSchema, formInitialValues } = useMemo(
    () => ({
      formInitialValues: estimationsApplied ? basicFees : {},
      formValidationSchema: object().shape({
        gasFeeSum: bigNumberValidation.clone().test('min-gas-fee', 'Gas fee must be positive', value => {
          if (estimationsApplied) {
            return BigNumber.isBigNumber(value) && value.isGreaterThan(0);
          }

          return true;
        }),
        storageLimitSum: bigNumberValidation
          .clone()
          .test('required-if-only-one-operation', 'Storage limit is required', value => {
            if (onlyOneOperation && estimationsApplied) {
              return BigNumber.isBigNumber(value) && value.gte(0);
            }

            return true;
          })
      })
    }),
    [basicFees]
  );

  return {
    ...restData,
    basicFees,
    estimationsApplied,
    onlyOneOperation,
    formValidationSchema,
    formInitialValues
  };
};

const applyEstimations = (initialParams: ParamsWithKind[], estimationsList: EstimationInterface[]) => {
  const estimationsApplied = estimationsList.length > 0;

  if (estimationsApplied === false) {
    return {
      finalParams: initialParams,
      estimationsApplied
    };
  }

  const withReveal = estimationsList.length === initialParams.length + 1;
  const reveal = withReveal ? estimationsList[0] : undefined;

  const finalParams: ParamsWithKind[] = initialParams.map((opParam, i) => {
    const estimation = estimationsList[withReveal ? i + 1 : i];

    const {
      fee = estimation.suggestedFeeMutez,
      gasLimit = estimation.gasLimit,
      storageLimit = estimation.storageLimit
    } = opParam.kind === OpKind.ACTIVATION ? {} : opParam;

    return { ...opParam, fee, gasLimit, storageLimit };
  });

  return {
    estimationsApplied,
    finalParams,
    reveal
  };
};

const calcBasicFees = (opParams: ParamsWithKind[], reveal?: EstimationInterface) => {
  const basicFees = opParams.reduce(
    (prev, opParam) => {
      if (opParam.kind === OpKind.ACTIVATION) {
        return prev;
      }

      const { fee = 0, storageLimit = 0 } = opParam;

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

  const revealGasFee = mutezToTz(new BigNumber(reveal ? reveal.suggestedFeeMutez : 0), 6);

  if (reveal) {
    basicFees.gasFeeSum = basicFees.gasFeeSum.plus(revealGasFee);
    basicFees.storageLimitSum = basicFees.storageLimitSum.plus(reveal.storageLimit);
  }

  return { basicFees, revealGasFee };
};

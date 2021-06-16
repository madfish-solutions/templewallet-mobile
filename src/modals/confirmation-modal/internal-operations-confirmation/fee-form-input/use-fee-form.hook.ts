import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { object } from 'yup';

import { assetAmountValidation } from '../../../../form/validation/asset-amount';
import { EstimationInterface } from '../../../../interfaces/estimation.interface';
import { mutezToTz } from '../../../../utils/tezos.util';

export const useFeeForm = (estimationsList: EstimationInterface[]) => {
  const { basicFees, estimationWasSuccessful } = useMemo(() => {
    const estimationWasSuccessful = estimationsList.length > 0;

    const basicFees = estimationWasSuccessful
      ? estimationsList.reduce(
          (sumPart, estimation) => ({
            gasFee: sumPart.gasFee.plus(mutezToTz(new BigNumber(estimation.totalCost), 6)),
            storageFee: sumPart.storageFee.plus(mutezToTz(new BigNumber(estimation.storageLimit), 6))
          }),
          { gasFee: new BigNumber(0), storageFee: new BigNumber(0) }
        )
      : { gasFee: new BigNumber(1e-6), storageFee: new BigNumber(0) };

    return { basicFees, estimationWasSuccessful };
  }, [estimationsList]);

  const { formValidationSchema, formInitialValues } = useMemo(
    () => ({
      formInitialValues: {
        gasFee: basicFees.gasFee.plus(1e-4),
        storageFee: basicFees.storageFee
      },
      formValidationSchema: object().shape({
        gasFee: assetAmountValidation
          .clone()
          .test('min-gas-fee', `Minimal value is ${basicFees.gasFee.toFixed()}`, value => {
            if (value instanceof BigNumber) {
              return value.gte(basicFees.gasFee);
            }

            return false;
          })
          .required(),
        storageFee: assetAmountValidation
          .clone()
          .test('min-storage-fee', `Minimal value is ${basicFees.storageFee.toFixed()}`, value => {
            if (value instanceof BigNumber) {
              return value.gte(basicFees.storageFee);
            }

            return false;
          })
          .required()
      })
    }),
    [basicFees]
  );

  return { basicFees, estimationWasSuccessful, formValidationSchema, formInitialValues };
};

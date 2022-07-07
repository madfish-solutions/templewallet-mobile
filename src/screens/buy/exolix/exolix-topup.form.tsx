import { BigNumber } from 'bignumber.js';
import { object, SchemaOf, string } from 'yup';

import { bigNumberValidation } from '../../../form/validation/big-number';
import { makeRequiredErrorMessage } from '../../../form/validation/messages';

export interface ExolixTopupFormValues {
  coinFrom: string;
  amount?: BigNumber;
}

export const exolixTopupFormValidationSchema: SchemaOf<ExolixTopupFormValues> = object().shape({
  coinFrom: string().required(),
  amount: bigNumberValidation
    .clone()
    .required(makeRequiredErrorMessage('Amount'))
    .test('is-greater-than', 'Should be greater than 0', (value: unknown) => {
      if (value instanceof BigNumber) {
        return value.gt(0);
      }

      return false;
    })
});

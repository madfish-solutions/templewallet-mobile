import { BigNumber } from 'bignumber.js';
import { object } from 'yup';

import { bigNumberValidation } from './big-number';
import { makeRequiredErrorMessage } from './messages';

export const assetAmountValidation = object().shape({
  asset: object().shape({}).required(makeRequiredErrorMessage('Asset')),
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

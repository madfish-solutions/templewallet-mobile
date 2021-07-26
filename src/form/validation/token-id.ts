import { BigNumber } from 'bignumber.js';
import { object, SchemaOf } from 'yup';

import { makeRequiredErrorMessage } from './messages';

export const tokenIdValidation: SchemaOf<BigNumber> = object()
  .shape({})
  .test('non-negative', 'Should be non-negative integer', value => {
    if (value instanceof BigNumber) {
      return value.integerValue().eq(value) && value.gte(0);
    }

    return false;
  })
  .default(new BigNumber(0))
  .required(makeRequiredErrorMessage('Token ID'));

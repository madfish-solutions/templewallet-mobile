import BigNumber from 'bignumber.js';

import { bigNumberSchema } from './big-number';

export const tokenIdValidation = bigNumberSchema()
  .test('non-negative', 'Should be non-negative integer', value => {
    if (value instanceof BigNumber) {
      return value.integerValue().eq(value) && value.gte(0);
    }

    return true;
  })
  .default(undefined);

import { BigNumber } from 'bignumber.js';
import { object, SchemaOf } from 'yup';

import { isDefined } from 'src/utils/is-defined';

export const tokenIdValidation: SchemaOf<BigNumber> = object()
  .shape({})
  .test('non-negative', 'Should be non-negative integer', value => {
    if (isDefined(value) && value instanceof BigNumber) {
      return value.integerValue().eq(value) && value.gte(0);
    }

    return true;
  })
  .default(undefined);

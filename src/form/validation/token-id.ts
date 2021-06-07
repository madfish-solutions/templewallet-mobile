import { BigNumber } from 'bignumber.js';
import { object, SchemaOf } from 'yup';

export const tokenIdValidation: SchemaOf<BigNumber> = object()
  .shape({})
  .test('non-negative', 'Should be non-negative integer', value => {
    if (!(value instanceof BigNumber)) {
      return false;
    }

    return value.integerValue().eq(value) && value.gte(0);
  })
  .default(new BigNumber(0))
  .required();

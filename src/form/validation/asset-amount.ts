import { BigNumber } from 'bignumber.js';
import { object, SchemaOf } from 'yup';

export const assetAmountValidation: SchemaOf<BigNumber> = object()
  .shape({})
  .test('is-greater-than', 'Should be greater than 0', value => {
    if (value instanceof BigNumber) {
      return value.gt(0);
    }

    return false;
  }) as SchemaOf<BigNumber>;

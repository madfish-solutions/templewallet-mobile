import { BigNumber } from 'bignumber.js';
import { object, SchemaOf } from 'yup';

export const assetAmountValidation: SchemaOf<BigNumber> = object()
  .shape({})
  .test('non-negative', 'Should be non-negative', value => {
    if (!(value instanceof BigNumber)) {
      return false;
    }

    return value.gte(0);
  }) as SchemaOf<BigNumber>;

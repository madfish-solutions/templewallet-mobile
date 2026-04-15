import { BigNumber } from 'bignumber.js';
import { mixed } from 'yup';

import { isDefined } from 'src/utils/is-defined';

export const bigNumberSchema = () =>
  mixed<BigNumber>().test(
    'is-big-number',
    'Should be a valid BigNumber',
    (value: unknown) => value instanceof BigNumber || !isDefined(value)
  );

export const withMinMaxBignumberValidation = bigNumberSchema()
  .test({
    name: 'is-greater-than',
    exclusive: false,
    params: {},
    message: 'min',
    test: function (value: unknown) {
      return !isDefined(this.parent.min) || (value instanceof BigNumber && value.gte(this.parent.min));
    }
  })
  .test({
    name: 'is-less-than',
    exclusive: false,
    params: {},
    message: 'max',
    test: function (value: unknown) {
      return !isDefined(this.parent.max) || (value instanceof BigNumber && value.lte(this.parent.max));
    }
  });

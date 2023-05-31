import { BigNumber } from 'bignumber.js';
import { object, SchemaOf } from 'yup';

import { isDefined } from 'src/utils/is-defined';

export const bigNumberValidation: SchemaOf<BigNumber> = object().shape({}) as SchemaOf<BigNumber>;

export const withMinMaxBignumberValidation = bigNumberValidation
  .clone()
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

import { BigNumber } from 'bignumber.js';

import { bigNumberValidation } from 'src/form/validation/big-number';
import { isDefined } from 'src/utils/is-defined';

export const withMinMaxTestsBignumberSchema = bigNumberValidation
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

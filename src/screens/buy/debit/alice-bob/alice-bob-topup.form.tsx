import { BigNumber } from 'bignumber.js';
import { number, object, SchemaOf, string } from 'yup';

import { bigNumberValidation } from '../../../../form/validation/big-number';
import { makeRequiredErrorMessage } from '../../../../form/validation/messages';
import { CurrenciesInterface } from '../../../../interfaces/exolix.interface';

export interface AliceBobTopupFormValues {
  exchangeInfo: {
    asset: CurrenciesInterface;
    amount?: BigNumber;
    min?: number;
    max?: number;
  };
}

export const AliceBobTopupFormValidationSchema: SchemaOf<AliceBobTopupFormValues> = object().shape({
  exchangeInfo: object().shape({
    asset: object()
      .shape({
        name: string(),
        icon: string(),
        code: string().required()
      })
      .required(),
    amount: bigNumberValidation
      .clone()
      .required(makeRequiredErrorMessage('Amount'))
      .test({
        name: 'is-greater-than',
        exclusive: false,
        params: {},
        message: 'min',
        test: function (value: unknown) {
          if (value instanceof BigNumber) {
            return value.gte(this.parent.min);
          }

          return false;
        }
      })
      .test({
        name: 'is-lesser-than',
        exclusive: false,
        params: {},
        message: 'max',
        test: function (value: unknown) {
          if (value instanceof BigNumber) {
            return value.lte(this.parent.max);
          }

          return false;
        }
      }),

    min: number(),
    max: number()
  })
});

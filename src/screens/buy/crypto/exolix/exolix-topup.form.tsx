import { BigNumber } from 'bignumber.js';
import { number, object, SchemaOf, string } from 'yup';

import { bigNumberValidation } from '../../../../form/validation/big-number';
import { makeRequiredErrorMessage } from '../../../../form/validation/messages';
import { CurrenciesInterface } from '../../../../interfaces/exolix.interface';

export interface ExolixTopupFormValues {
  coinFrom: {
    asset: CurrenciesInterface;
    amount?: BigNumber;
    min?: number;
    max?: number;
  };
  rate?: number;
  coinTo?: {
    asset: CurrenciesInterface;
    amount?: BigNumber;
  };
}

export const exolixTopupFormValidationSchema: SchemaOf<ExolixTopupFormValues> = object().shape({
  coinFrom: object().shape({
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
        message: 'Should be greater than Min amount',
        test: function (value: unknown) {
          if (value instanceof BigNumber) {
            return value.gt(this.parent.min);
          }

          return false;
        }
      })
      .test({
        name: 'is-lesser-than',
        exclusive: false,
        params: {},
        message: 'Should be lesser than Max amount',
        test: function (value: unknown) {
          if (value instanceof BigNumber) {
            return value.lt(this.parent.max);
          }

          return false;
        }
      }),

    min: number(),
    max: number()
  }),
  rate: number().required(),
  coinTo: object().shape({
    asset: object()
      .shape({
        name: string(),
        icon: string(),
        code: string().required()
      })
      .required(),
    amount: bigNumberValidation.clone().required(makeRequiredErrorMessage('Amount'))
  })
});

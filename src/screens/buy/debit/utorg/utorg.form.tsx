import { BigNumber } from 'bignumber.js';
import { number, object, SchemaOf, string } from 'yup';

import { bigNumberValidation } from '../../../../form/validation/big-number';
import { makeRequiredErrorMessage } from '../../../../form/validation/messages';
import { TopUpInputInterface } from '../../../../interfaces/topup.interface';

export interface UtorgFormValues {
  sendInput: {
    asset: TopUpInputInterface;
    amount?: BigNumber;
  };
  getOutput: {
    asset: TopUpInputInterface;
    amount?: BigNumber;
    min?: number;
    max?: number;
  };
}

export const UtorgFormValidationSchema: SchemaOf<UtorgFormValues> = object().shape({
  sendInput: object().shape({
    asset: object()
      .shape({
        code: string().required(),
        icon: string()
      })
      .required(),
    amount: bigNumberValidation.clone().required(makeRequiredErrorMessage('Amount'))
  }),
  getOutput: object().shape({
    asset: object()
      .shape({
        code: string().required(),
        icon: string()
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

import { BigNumber } from 'bignumber.js';
import { number, object, SchemaOf, string } from 'yup';

import { bigNumberValidation } from '../../../form/validation/big-number';
import { makeRequiredErrorMessage } from '../../../form/validation/messages';
import { CurrenciesInterface } from '../../../interfaces/exolix.interface';

export interface ExolixTopupFormValues {
  coinFrom: {
    asset: CurrenciesInterface;
    amount?: BigNumber;
    min?: number;
    max?: number;
  };
  coinTo: {
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
      .test('is-greater-than', 'Should be greater than 0', (value: unknown) => {
        if (value instanceof BigNumber) {
          return value.gt(0);
        }

        return false;
      }),
    min: number(),
    max: number()
  }),
  coinTo: object().shape({
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
      .test('is-greater-than', 'Should be greater than 0', (value: unknown) => {
        if (value instanceof BigNumber) {
          return value.gt(0);
        }

        return false;
      })
  })
});

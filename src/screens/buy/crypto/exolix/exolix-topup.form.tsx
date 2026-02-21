import { BigNumber } from 'bignumber.js';
import { number, object, SchemaOf, string } from 'yup';

import { bigNumberSchema, withMinMaxBignumberValidation } from 'src/form/validation/big-number';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { TopUpWithNetworkInterface } from 'src/interfaces/topup.interface';

export interface ExolixTopupFormValues {
  coinFrom: {
    asset: TopUpWithNetworkInterface;
    amount?: BigNumber;
    min?: number;
    max?: number;
  };
  rate: number;
  coinTo: {
    asset: TopUpWithNetworkInterface;
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
    amount: withMinMaxBignumberValidation.clone().required(makeRequiredErrorMessage('Amount')),
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
    amount: bigNumberSchema()
      .required(makeRequiredErrorMessage('Amount'))
      .test('is-greater-than', 'Should be greater than 0', (value: unknown) => {
        if (value instanceof BigNumber) {
          return value.gt(0);
        }

        return false;
      })
  })
});

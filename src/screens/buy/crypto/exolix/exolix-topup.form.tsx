import { BigNumber } from 'bignumber.js';
import { number, object, SchemaOf, string } from 'yup';

import { bigNumberValidation } from '../../../../form/validation/big-number';
import { makeRequiredErrorMessage } from '../../../../form/validation/messages';
import { TopUpInputInterface, TopUpOutputInterface } from '../../../../interfaces/topup.interface';
import { withMinMaxTestsBignumberSchema } from '../../utils/with-min-max-tests-bignumber-schema.util';

export interface ExolixTopupFormValues {
  coinFrom: {
    asset: TopUpInputInterface;
    amount?: BigNumber;
    min?: number;
    max?: number;
  };
  rate: number;
  coinTo: {
    asset: TopUpOutputInterface;
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
    amount: withMinMaxTestsBignumberSchema.clone().required(makeRequiredErrorMessage('Amount')),
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

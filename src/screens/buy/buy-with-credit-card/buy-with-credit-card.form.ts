import { BigNumber } from 'bignumber.js';
import { number, object, SchemaOf, string } from 'yup';

import { bigNumberValidation } from 'src/form/validation/big-number';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { TopUpInputInterface, PaymentProviderInterface } from 'src/interfaces/topup.interface';
import { isDefined } from 'src/utils/is-defined';

export interface BuyWithCreditCardFormValues {
  sendInput: {
    asset: TopUpInputInterface;
    amount?: BigNumber;
    min?: number;
    max?: number;
  };
  getOutput: {
    asset: TopUpInputInterface;
    amount?: BigNumber;
    min?: number;
    max?: number;
  };
  paymentProvider?: PaymentProviderInterface;
}

const withAmountsTest = (schema: any) =>
  schema
    .test({
      name: 'is-greater-than',
      exclusive: false,
      params: {},
      message: 'min',
      test: function (value: unknown) {
        if (!isDefined(this.parent.min)) {
          return true;
        }

        if (value instanceof BigNumber) {
          return value.gte(this.parent.min);
        }

        return false;
      }
    })
    .test({
      name: 'is-less-than',
      exclusive: false,
      params: {},
      message: 'max',
      test: function (value: unknown) {
        if (!isDefined(this.parent.max)) {
          return true;
        }

        if (value instanceof BigNumber) {
          return value.lte(this.parent.max);
        }

        return false;
      }
    });

const assetSchema = object()
  .shape({
    code: string().required(),
    icon: string()
  })
  .required();

export const BuyWithCreditCardValidationSchema: SchemaOf<BuyWithCreditCardFormValues> = object().shape({
  sendInput: object().shape({
    asset: assetSchema.clone(),
    amount: withAmountsTest(bigNumberValidation.clone().required(makeRequiredErrorMessage('Amount'))),
    min: number(),
    max: number()
  }),
  getOutput: object().shape({
    asset: assetSchema.clone(),
    amount: withAmountsTest(bigNumberValidation.clone().required(makeRequiredErrorMessage('Amount'))),
    min: number(),
    max: number()
  }),
  paymentProvider: object()
    .shape({
      name: string().required(),
      id: string().required(),
      iconName: string().required()
    })
    .required('Please select payment provider')
});

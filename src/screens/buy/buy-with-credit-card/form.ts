import { BigNumber } from 'bignumber.js';
import { number, object, SchemaOf, string } from 'yup';

import { bigNumberValidation, withMinMaxBignumberValidation } from 'src/form/validation/big-number';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { PaymentProviderInterface } from 'src/interfaces/payment-provider';
import { TopUpInputInterface } from 'src/store/buy-with-credit-card/types';

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
  };
  paymentProvider?: PaymentProviderInterface;
}

const assetSchema = object()
  .shape({
    code: string().required(),
    icon: string()
  })
  .required();

export const BuyWithCreditCardValidationSchema = object().shape({
  sendInput: object().shape({
    asset: assetSchema.clone(),
    amount: withMinMaxBignumberValidation.clone().required(makeRequiredErrorMessage('Amount')),
    min: number(),
    max: number()
  }),
  getOutput: object().shape({
    asset: assetSchema.clone(),
    amount: bigNumberValidation.clone().test({
      name: 'is-positive',
      exclusive: false,
      params: {},
      message: 'Value of getOutput.amount must be positive',
      test: function (value: unknown) {
        return value instanceof BigNumber && value.isGreaterThan(0);
      }
    })
  }),
  paymentProvider: object()
    .shape({
      name: string().required(),
      id: string().required(),
      iconName: string().required()
    })
    .required('Please select payment provider')
}) as unknown as SchemaOf<BuyWithCreditCardFormValues>;

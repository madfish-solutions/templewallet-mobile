import { BigNumber } from 'bignumber.js';
import { number, object, SchemaOf, string } from 'yup';

import { bigNumberValidation } from 'src/form/validation/big-number';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { TopUpInputInterface, PaymentProviderInterface } from 'src/interfaces/topup.interface';

import { withMinMaxTestsBignumberSchema } from '../utils/with-min-max-tests-bignumber-schema.util';

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

export const BuyWithCreditCardValidationSchema: SchemaOf<BuyWithCreditCardFormValues> = object().shape({
  sendInput: object().shape({
    asset: assetSchema.clone(),
    amount: withMinMaxTestsBignumberSchema.clone().required(makeRequiredErrorMessage('Amount')),
    min: number(),
    max: number()
  }),
  getOutput: object().shape({
    asset: assetSchema.clone(),
    amount: bigNumberValidation.clone().required(makeRequiredErrorMessage('Amount'))
  }),
  paymentProvider: object()
    .shape({
      name: string().required(),
      id: string().required(),
      iconName: string().required()
    })
    .required('Please select payment provider')
});

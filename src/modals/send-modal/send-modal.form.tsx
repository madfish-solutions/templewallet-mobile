import { BigNumber } from 'bignumber.js';
import { object, SchemaOf, string } from 'yup';

import { assetAmountValidation } from '../../form/validation/asset-amount';
import { AccountInterface } from '../../interfaces/account.interface';

export type SendModalFormValues = {
  account: AccountInterface;
  amount: BigNumber;
  recipient: string;
};

export const sendModalValidationSchema: SchemaOf<SendModalFormValues> = object().shape({
  amount: assetAmountValidation.clone().required(),
  account: object().shape({}).required(),
  recipient: string().required()
});

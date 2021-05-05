import { number, object, SchemaOf, string } from 'yup';

import { AccountInterface } from '../../../interfaces/account.interface';

export type SendBottomSheetFormValues = {
  account: AccountInterface;
  amount: number;
  recipient: string;
  gasFee: number;
};

export const sendBottomSheetValidationSchema: SchemaOf<SendBottomSheetFormValues> = object().shape({
  amount: number().required(),
  account: object().shape({}).required(),
  recipient: string().required(),
  gasFee: number().required()
});

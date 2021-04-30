import { number, object, SchemaOf, string } from 'yup';

import { AccountInterface } from '../../../interfaces/account.interface';

export type SendBottomSheetFormValues = {
  account: AccountInterface;
  amount: string;
  recipient: string;
  gasFee?: number;
};

export const sendBottomSheetValidationSchema: SchemaOf<SendBottomSheetFormValues> = object().shape({
  account: object().shape({}).required(),
  amount: string().required(),
  recipient: string().required(),
  gasFee: number().required()
});

import { object, SchemaOf, string } from 'yup';

import { AccountInterface } from '../../../interfaces/account.interface';

export type SendBottomSheetFormValues = {
  account: AccountInterface;
  amount: string;
  recipient: string;
};

export const sendBottomSheetValidationSchema: SchemaOf<SendBottomSheetFormValues> = object().shape({
  account: object()
    .shape({
      name: string().required(),
      publicKey: string().required(),
      publicKeyHash: string().required()
    })
    .required(),
  amount: string().required(),
  recipient: string().required()
});

import { number, object, SchemaOf, string } from 'yup';

import { AccountInterface } from '../../interfaces/account.interface';

export type SendModalFormValues = {
  account: AccountInterface;
  amount: number;
  recipient: string;
};

export const sendModalValidationSchema: SchemaOf<SendModalFormValues> = object().shape({
  amount: number().required(),
  account: object().shape({}).required(),
  recipient: string().required()
});

import { object, SchemaOf, string } from 'yup';

import { AccountInterface } from '../../interfaces/account.interface';

export type RevealPrivateKeyModalFormValues = {
  account: AccountInterface;
  privateKey: string;
};

export const revealPrivateKeyModalValidationSchema: SchemaOf<RevealPrivateKeyModalFormValues> = object().shape({
  account: object().shape({}).required(),
  privateKey: string().required()
});

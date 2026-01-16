import { object, SchemaOf } from 'yup';

import { AccountInterface } from 'src/interfaces/account.interface';

export type RevealPrivateKeyModalFormValues = {
  account: AccountInterface;
};

export const revealPrivateKeyModalValidationSchema: SchemaOf<RevealPrivateKeyModalFormValues> = object().shape({
  account: object().shape({}).required()
});

import { object, SchemaOf } from 'yup';

import { Account } from 'src/interfaces/account.interfaces';

export type RevealPrivateKeyModalFormValues = {
  account: Account;
};

export const revealPrivateKeyModalValidationSchema: SchemaOf<RevealPrivateKeyModalFormValues> = object().shape({
  account: object().shape({}).required()
});

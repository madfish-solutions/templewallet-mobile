import { object, SchemaOf } from 'yup';

import { Account } from 'src/interfaces/account.interfaces';

export type RevealSeedPhraseModalFormValues = {
  account: Account;
};

export const revealSeedPhraseModalValidationSchema: SchemaOf<RevealSeedPhraseModalFormValues> = object().shape({
  account: object().shape({}).required()
});

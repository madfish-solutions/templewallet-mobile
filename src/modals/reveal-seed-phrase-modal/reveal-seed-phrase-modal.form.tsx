import { object, SchemaOf } from 'yup';

import { AccountInterface } from 'src/interfaces/account.interface';

export type RevealSeedPhraseModalFormValues = {
  account: AccountInterface;
};

export const revealSeedPhraseModalValidationSchema: SchemaOf<RevealSeedPhraseModalFormValues> = object().shape({
  account: object().shape({}).required()
});

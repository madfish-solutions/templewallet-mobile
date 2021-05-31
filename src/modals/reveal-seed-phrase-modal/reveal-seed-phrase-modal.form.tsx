import { object, SchemaOf, string } from 'yup';

import { AccountInterface } from '../../interfaces/account.interface';

export type RevealSeedPhraseModalFormValues = {
  account: AccountInterface;
  derivationPath: string;
  seedPhrase: string;
};

export const revealSeedPhraseModalValidationSchema: SchemaOf<RevealSeedPhraseModalFormValues> = object().shape({
  account: object().shape({}).required(),
  derivationPath: string().required(),
  seedPhrase: string().required()
});

import { object, SchemaOf } from 'yup';

import { seedPhraseValidation } from '../../../../form/validation/seed-phrase';

export type ImportWalletFromSeedPhraseFormValues = {
  seedPhrase: string;
};

export const importWalletFromSeedPhraseValidationSchema: SchemaOf<ImportWalletFromSeedPhraseFormValues> =
  object().shape({
    seedPhrase: seedPhraseValidation
  });

export const importWalletFromSeedPhraseInitialValues: ImportWalletFromSeedPhraseFormValues = {
  seedPhrase: ''
};

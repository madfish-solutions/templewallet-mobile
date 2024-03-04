import { object, SchemaOf } from 'yup';

import { seedPhraseValidation } from 'src/form/validation/seed-phrase';

type ImportWalletFromSeedPhraseFormValues = {
  seedPhrase: string;
};

export const importWalletFromSeedPhraseValidationSchema: SchemaOf<ImportWalletFromSeedPhraseFormValues> =
  object().shape({
    seedPhrase: seedPhraseValidation
  });

export const importWalletFromSeedPhraseInitialValues: ImportWalletFromSeedPhraseFormValues = {
  seedPhrase: ''
};

import { object, SchemaOf } from 'yup';

import { derivationPathValidation } from 'src/form/validation/derivation-path';
import { seedPhraseValidation } from 'src/form/validation/seed-phrase';

export type ImportAccountSeedValues = {
  seedPhrase: string;
  derivationPath?: string;
};

export const importAccountSeedInitialValues: ImportAccountSeedValues = {
  seedPhrase: '',
  derivationPath: ''
};

export const importAccountSeedValidationSchema: SchemaOf<ImportAccountSeedValues> = object().shape({
  seedPhrase: seedPhraseValidation,
  derivationPath: derivationPathValidation
});

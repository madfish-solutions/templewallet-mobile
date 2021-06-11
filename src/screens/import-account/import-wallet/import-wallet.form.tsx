import { object, SchemaOf } from 'yup';

import { seedPhraseValidation } from '../../../form/validation/seed-phrase';

export type ImportWalletFormValues = {
  seedPhrase: string;
};

export const importWalletValidationSchema: SchemaOf<ImportWalletFormValues> = object().shape({
  seedPhrase: seedPhraseValidation
});

export const importWalletInitialValues: ImportWalletFormValues = {
  seedPhrase: ''
};

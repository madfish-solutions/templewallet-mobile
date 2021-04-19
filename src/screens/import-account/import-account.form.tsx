import { object, SchemaOf } from 'yup';

import { acceptTermsValidation } from '../../form/validation/accept-terms';
import { passwordConfirmationValidation, passwordValidation } from '../../form/validation/password';
import { seedPhraseValidation } from '../../form/validation/seed-phrase';

export type ImportAccountFormValues = {
  seedPhrase: string;
  password: string;
  passwordConfirmation: string;
  acceptTerms: boolean;
};

export const importAccountValidationSchema: SchemaOf<ImportAccountFormValues> = object().shape({
  seedPhrase: seedPhraseValidation,
  password: passwordValidation,
  passwordConfirmation: passwordConfirmationValidation,
  acceptTerms: acceptTermsValidation
});

export const importAccountInitialValues: ImportAccountFormValues = {
  seedPhrase: '',
  password: '',
  passwordConfirmation: '',
  acceptTerms: false
};
